CREATE OR REPLACE FUNCTION cntctmerge(integer, integer, boolean) RETURNS boolean AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSourceCntctId ALIAS FOR $1;
  pTargetCntctId ALIAS FOR $2;
  pPurge ALIAS FOR $3;
  _fk		RECORD;
  _pk   	RECORD;
  _sel		RECORD;
  _seq  	INTEGER;
  _col		TEXT;
  _pkcol  	TEXT;
  _qry  	TEXT;
  _multi	BOOLEAN;

BEGIN
  -- Validate
  IF (pSourceCntctId IS NULL) THEN
    RAISE EXCEPTION 'Source contact id can not be null';
  ELSIF (pTargetCntctId IS NULL) THEN
    RAISE EXCEPTION 'Target contact id can not be null';
  ELSIF (pPurge IS NULL) THEN
    RAISE EXCEPTION 'Purge flag can not be null';
  END IF;
  
  -- Determine where this contact is used by analyzing foreign key linkages and update each
  FOR _fk IN
    SELECT pg_namespace.nspname AS schemaname, con.relname AS tablename, conkey AS seq, conrelid AS class_id 
    FROM pg_constraint, pg_class f, pg_class con, pg_namespace
    WHERE confrelid=f.oid
    AND conrelid=con.oid
    AND f.relname = 'cntct'
    AND con.relnamespace=pg_namespace.oid
    AND con.relname NOT IN ('cntctsel', 'cntctmrgd', 'mrghist','trgthist')
  LOOP
    -- Validate
    IF (ARRAY_UPPER(_fk.seq,1) > 1) THEN
      RAISE EXCEPTION 'Updates to tables where the contact is one of multiple foreign key columns is not supported. Error on Table: %',
        pg_namespace.nspname || '.' || con.relname;
    END IF;
    
    _seq := _fk.seq[1];

    -- Get the specific column name
    SELECT attname INTO _col
    FROM pg_attribute, pg_class
    WHERE ((attrelid=pg_class.oid)
    AND (pg_class.oid=_fk.class_id)
    AND (attnum=_seq));

    IF (NOT pPurge) THEN
    -- Cache what we're going to do so we can restore if need be.
    -- Start by determining the primary key column for this table.
      _multi := false;
      _qry := 'SELECT pg_attribute.attname AS key
               FROM pg_attribute, pg_class 
               WHERE pg_class.relnamespace = (
                 SELECT oid 
                 FROM pg_namespace 
                 WHERE pg_namespace.nspname = ''' || _fk.schemaname || ''') 
                AND  pg_class.oid IN (
                 SELECT indexrelid 
                 FROM pg_index 
                 WHERE indisprimary = true 
                  AND indrelid IN (
                    SELECT oid 
                    FROM pg_class 
                    WHERE lower(relname) = ''' || _fk.tablename || ''')) 
                AND pg_attribute.attrelid = pg_class.oid 
                AND pg_attribute.attisdropped = false 
               ORDER BY pg_attribute.attnum;';

      FOR _pk IN 
        EXECUTE _qry
      LOOP
        IF (_multi) THEN
          RAISE EXCEPTION 'Reference tables with composite primary keys not supported.  Try the merge and purge option.';
        END IF;
        _pkcol := _pk.key;
        _multi := true;
      END LOOP;

      -- Gather and store the history
      _qry := 'INSERT INTO mrghist 
               SELECT ' || pSourceCntctId || ', ''' 
                        || _fk.schemaname || '.' || _fk.tablename || ''', ''' 
                        || _pkcol || ''', ' 
                        || _pkcol || ', '''
                        || _col || ''' 
               FROM ' || _fk.schemaname || '.' || _fk.tablename || '
               WHERE (' || _col || '=' || pSourceCntctId || ');';
                   --           raise exception '%',_qry;
      EXECUTE _qry;
      
    END IF;

    -- Merge references
    _qry := 'UPDATE ' || _fk.schemaname || '.' || _fk.tablename ||
            ' SET ' || _col || '=' || pTargetCntctId ||
            ' WHERE (' || _col || '=' || pSourceCntctId || ');';
            
    EXECUTE _qry;
         
  END LOOP;

  -- Merge cases with no foreign key
  IF (NOT pPurge) THEN
    INSERT INTO mrghist 
    SELECT pSourceCntctId,
      'comment',
      'comment_id', 
      comment_id,
      'comment_source_id'
    FROM comment
    WHERE ((comment_source_id= pSourceCntctId)
    AND (comment_source='T'));

    INSERT INTO mrghist 
    SELECT pSourceCntctId,
      'docass',
      'docass_id', 
      docass_id,
      'docass_source_id'
    FROM docass
    WHERE ((docass_source_id= pSourceCntctId)
    AND (docass_source_type='T'));

    INSERT INTO mrghist 
    SELECT pSourceCntctId,
      'docass',
      'docass_id', 
      docass_id,
      'docass_target_id'
    FROM docass
    WHERE ((docass_target_id= pSourceCntctId)
    AND (docass_target_type='T'));

    INSERT INTO mrghist 
    SELECT pSourceCntctId,
      'vendinfo',
      'vend_id', 
      vend_id,
      'vend_cntct1_id'
    FROM vendinfo
    WHERE (vend_cntct1_id=pSourceCntctId);

    INSERT INTO mrghist 
    SELECT pSourceCntctId,
      'vendinfo',
      'vend_id', 
      vend_id,
      'vend_cntct2_id'
    FROM vendinfo
    WHERE (vend_cntct2_id=pSourceCntctId);

    IF (fetchMetricBool('EnableBatchManager') AND packageIsEnabled('xtbatch')) THEN
      INSERT INTO mrghist 
      SELECT pSourceCntctId,
      'xtbatch.emlassc',
      'emlassc_id', 
      emlassc_id,
      'emlassc_assc_id'
      FROM xtbatch.emlassc
      WHERE ((emlassc_assc_id= pSourceCntctId)
      AND (emlassc_type='T'));
    END IF;
  END IF;

  UPDATE comment
  SET comment_source_id = pTargetCntctId
  WHERE ((comment_source = 'T')
   AND (comment_source_id = pSourceCntctId));

  UPDATE docass
  SET docass_source_id = pTargetCntctId
  WHERE ((docass_source_type = 'T')
   AND (docass_source_id = pSourceCntctId));

  UPDATE docass
  SET docass_target_id = pTargetCntctId
  WHERE ((docass_target_type = 'T')
   AND (docass_target_id = pSourceCntctId));

  UPDATE vendinfo
  SET vend_cntct1_id = pTargetCntctId
  WHERE (vend_cntct1_id = pSourceCntctId);

  UPDATE vendinfo
  SET vend_cntct2_id = pTargetCntctId
  WHERE (vend_cntct2_id = pSourceCntctId);

  IF (fetchMetricBool('EnableBatchManager') AND packageIsEnabled('xtbatch')) THEN
    UPDATE xtbatch.emlassc
    SET emlassc_assc_id = pTargetCntctId
    WHERE ((emlassc_type = 'T')
     AND (emlassc_assc_id = pSourceCntctId));
  END IF;

  IF (NOT pPurge) THEN
  -- Record that this has been merged if not already
    IF (SELECT (COUNT(cntctmrgd_cntct_id) = 0) 
        FROM cntctmrgd
        WHERE (cntctmrgd_cntct_id=pSourceCntctId)) THEN
      INSERT INTO cntctmrgd VALUES (pSourceCntctId,false);
    END IF;
  END IF;

 -- Merge field detail to target
  SELECT * INTO _sel 
  FROM cntctsel 
    JOIN cntct ON (cntctsel_cntct_id=cntct_id)
  WHERE (cntctsel_cntct_id=pSourceCntctId);
  
  IF (FOUND) THEN
    IF (_sel.cntctsel_mrg_crmacct_id) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_crmacct_id', cntct_crmacct_id::text || '::integer'
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_crmacct_id=_sel.cntct_crmacct_id WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_addr_id) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_addr_id', cntct_addr_id::text || '::integer'
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_addr_id=_sel.cntct_addr_id WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_first_name) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_first_name', '''' || cntct_first_name || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_first_name=_sel.cntct_first_name WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_last_name) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_last_name', '''' || cntct_last_name || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_last_name=_sel.cntct_last_name WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_honorific) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_honorific', '''' || cntct_honorific || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_honorific=_sel.cntct_honorific WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_initials) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_initials', '''' || cntct_initials || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_initials=_sel.cntct_initials WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_phone) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_phone', '''' || cntct_phone || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_phone=_sel.cntct_phone WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_phone2) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_phone2', '''' || cntct_phone2 || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_phone2=_sel.cntct_phone2 WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_fax)  THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_fax', '''' || cntct_fax || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_fax=_sel.cntct_fax WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_email)  THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_email', '''' || cntct_email || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_email=_sel.cntct_email WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_webaddr) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_webaddr', '''' || cntct_webaddr || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_webaddr=_sel.cntct_webaddr WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_notes) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_notes', '''' || cntct_notes || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_notes=cntct_notes || '

      ' || _sel.cntct_notes WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_title) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_title', '''' || cntct_title || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_title=_sel.cntct_title WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_middle) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_middle', '''' || cntct_middle || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_middle=_sel.cntct_middle WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_suffix) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_suffix', '''' || cntct_suffix || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_suffix=_sel.cntct_suffix WHERE (cntct_id=pTargetCntctId);
    END IF;
    IF (_sel.cntctsel_mrg_owner_username) THEN
      IF (NOT pPurge) THEN
        INSERT INTO trgthist
        SELECT pSourceCntctId,pTargetCntctId,'cntct_owner_username', '''' || cntct_owner_username || ''''
        FROM cntct
        WHERE (cntct_id=pTargetCntctId);
      END IF;
      UPDATE cntct SET cntct_owner_username=_sel.cntct_owner_username WHERE (cntct_id=pTargetCntctId);
    END IF;
  ELSE
    RAISE EXCEPTION 'Source Contact not Found';
  END IF;

  -- Disposition source contact
  IF (pPurge) THEN
    DELETE FROM cntct WHERE cntct_id = pSourceCntctId;
  END IF;

  -- Deactivate contact
  UPDATE cntct SET cntct_active = false WHERE (cntct_id=pSourceCntctId);
  
  -- Clean up
  DELETE FROM cntctsel WHERE (cntctsel_cntct_id=pSourceCntctId);

  RETURN true;
END;
$$ LANGUAGE 'plpgsql';
