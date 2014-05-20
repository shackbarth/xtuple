CREATE OR REPLACE FUNCTION merge2crmaccts(INTEGER, INTEGER, BOOLEAN) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSourceId ALIAS FOR $1;
  pTargetId ALIAS FOR $2;
  _purge    BOOLEAN := COALESCE($3, FALSE);

  _coldesc    RECORD;
  _count      INTEGER := 0;
  _hassubtype BOOLEAN;
  _mrgcol     BOOLEAN;
  _result     INTEGER := 0;
  _sel        RECORD;
  _colname    TEXT;
  _tmpid      INTEGER;

BEGIN
  -- Validate
  IF (pSourceId = pTargetId) THEN
    RAISE NOTICE 'Tried to merge a CRM Account with itself: %.', pSourceId;
    RETURN 0;
  ELSIF (pSourceId IS NULL) THEN
    RAISE EXCEPTION 'Merge source id cannot be null [xtuple: merge, -1]';
  ELSIF NOT(EXISTS(SELECT 1 FROM crmacct WHERE crmacct_id=pSourceId)) THEN
    RAISE EXCEPTION 'Merge source % not found [xtuple: merge, -2, %]',
                    pSourceId, pSourceId;
  ELSIF (pTargetId IS NULL) THEN
    RAISE EXCEPTION 'Merge target id cannot be null [xtuple: merge, -3]';
  ELSIF NOT(EXISTS(SELECT 1 FROM crmacct WHERE crmacct_id=pTargetId)) THEN
    RAISE EXCEPTION 'Merge target % not found [xtuple: merge, -4, %]',
                    pTargetId, pTargetId;
  ELSIF NOT(EXISTS(SELECT 1
                     FROM crmacctsel
                    WHERE (crmacctsel_src_crmacct_id=pSourceId)
                      AND (crmacctsel_dest_crmacct_id=pTargetId))) THEN
    RAISE EXCEPTION 'Source % and target % have not been selected for merging [xtuple: merge, -5, %, %]',
                    pSourceId, pTargetId, pSourceId, pTargetId;
  END IF;

  _result:= changeFkeyPointers('public', 'crmacct', pSourceId, pTargetId,
                               ARRAY[ 'crmacctsel', 'crmacctmrgd' ], _purge)
          + changePseudoFKeyPointers('public', 'alarm', 'alarm_source_id',
                                     pSourceId, 'public', 'crmacct', pTargetId,
                                     'alarm_source', 'CRMA', _purge)
          + changePseudoFKeyPointers('public', 'charass', 'charass_target_id',
                                     pSourceId, 'public', 'crmacct', pTargetId,
                                     'charass_target_type', 'CRMACCT', _purge)
          + changePseudoFKeyPointers('public', 'comment', 'comment_source_id',
                                     pSourceId, 'public', 'crmacct', pTargetId,
                                     'comment_source', 'CRMA', _purge)
          + changePseudoFKeyPointers('public', 'docass', 'docass_source_id',
                                     pSourceId, 'public', 'crmacct', pTargetId,
                                     'docass_source_type', 'CRMA', _purge)
          + changePseudoFKeyPointers('public', 'docass', 'docass_target_id',
                                     pSourceId, 'public', 'crmacct', pTargetId,
                                     'docass_target_type', 'CRMA', _purge)
          + changePseudoFKeyPointers('public', 'imageass', 'imageass_source_id',
                                     pSourceId, 'public', 'crmacct', pTargetId,
                                     'imageass_source', 'CRMA', _purge)
          ;

  -- TODO: find a generic way to handle pseudofkeys in packages - see 9401
  IF (fetchMetricBool('EnableBatchManager') AND packageIsEnabled('xtbatch')) THEN
    _result:= _result
            + changePseudoFKeyPointers('xtbatch', 'emlassc', 'emlassc_assc_id',
                                       pSourceId, 'public', 'crmacct', pTargetId,
                                       'emlassc_type', 'CRMA', _purge);
  END IF;

  -- back up all of the values in the target record that are about to be changed
  FOR _coldesc IN SELECT attname, typname
                    FROM pg_attribute
                    JOIN pg_type      ON (atttypid=pg_type.oid)
                    JOIN pg_class     ON (attrelid=pg_class.oid)
                    JOIN pg_namespace ON (relnamespace=pg_namespace.oid)
                   WHERE (attnum >= 0)
                     AND (relname='crmacct')
                     AND (nspname='public')
                     AND (attname NOT IN ('crmacct_id', 'crmacct_number'))
  LOOP

    -- if we're supposed to merge this column at all
    EXECUTE 'SELECT ' || quote_ident('crmacctsel_mrg_' || _coldesc.attname) || '
               FROM crmacctsel
              WHERE ((crmacctsel_src_crmacct_id='  || pSourceId || ')
                 AND (crmacctsel_dest_crmacct_id=' || pTargetId || '))' INTO _mrgcol;

    IF (_mrgcol) THEN
      _colname := REPLACE(_coldesc.attname, 'crmacctsel_mrg_', '');

      -- optionally back up the old value from the destination
      -- we'll back up the old value from the source further down
      IF (NOT _purge) THEN
        BEGIN
          EXECUTE 'INSERT INTO mrgundo (
                       mrgundo_schema,      mrgundo_table,
                       mrgundo_pkey_col,    mrgundo_pkey_id,
                       mrgundo_col,         mrgundo_value,      mrgundo_type,
                       mrgundo_base_schema, mrgundo_base_table, mrgundo_base_id
                 ) SELECT ''public'',     ''crmacct'',
                          ''crmacct_id'', crmacct_id, '   ||
                          quote_literal(_colname)         || ', ' ||
                          quote_ident(_colname)           || ', ' ||
                          quote_literal(_coldesc.typname) || ',
                          ''public'', ''crmacct'', crmacct_id
                     FROM crmacct
                    WHERE (crmacct_id=' || pTargetId || ');' ;
        EXCEPTION WHEN unique_violation THEN
          RAISE EXCEPTION 'Could not make a backup copy of % when merging % into % [xtuple: merge, -8, %, %, public, crmacct, %]',
                       _colname, pSourceId, pTargetId,
                       _colname, pSourceId, pTargetId;
        END;
      END IF;

      -- TODO: what do we do about users?
      /* update the destination crmacct in one of 3 different ways:
         - crmacct_notes might be concatenated from more than one source record
	 - foreign keys to crm account subtype records (e.g. crmacct_cust_id)
           must not leave orphaned records and must avoid uniqueness violations
         - some fields can simply be updated in place
       */
      IF (_colname = 'crmacct_notes') THEN
        EXECUTE 'UPDATE crmacct dest
                    SET '      || quote_ident(_colname) ||
                      '=dest.' || quote_ident(_colname) ||
                      E' || E''\\n'' || src.' || _colname || '
                  FROM crmacct src
                  JOIN crmacctsel ON (src.crmacct_id=crmacctsel_src_crmacct_id)
                 WHERE ((dest.crmacct_id=crmacctsel_dest_crmacct_id)
                    AND (dest.crmacct_id!=crmacctsel_src_crmacct_id));';

      ELSIF (_colname IN ('crmacct_cust_id', 'crmacct_prospect_id', 
                          'crmacct_vend_id', 'crmacct_taxauth_id',
                          'crmacct_emp_id',  'crmacct_salesrep_id')) THEN
        IF (_colname IN ('crmacct_cust_id', 'crmacct_prospect_id')) THEN
          EXECUTE 'SELECT src.' || quote_ident(_colname) || ' IS NOT NULL
                      AND (dest.crmacct_prospect_id IS NOT NULL OR
                           dest.crmacct_cust_id IS NOT NULL)
                     FROM crmacct src
                     JOIN crmacctsel ON (src.crmacct_id=crmacctsel_src_crmacct_id)
                     JOIN crmacct dest ON (crmacctsel_dest_crmacct_id=dest.crmacct_id)
                    WHERE ((src.crmacct_id='  || pSourceId || ')
                       AND (dest.crmacct_id=' || pTargetId || '))' INTO _hassubtype;
          IF (_hassubtype) THEN
            RAISE EXCEPTION 'Cannot merge two CRM Accounts that both refer to Customers and/or Prospects [xtuple: merge, -6, %, %]',
                            pSourceId, pTargetId;
          END IF;
        ELSE
          EXECUTE 'SELECT src.' || quote_ident(_colname) || ' IS NOT NULL
                      AND dest.'|| quote_ident(_colname) || ' IS NOT NULL
                     FROM crmacct src
                     JOIN crmacctsel ON (src.crmacct_id=crmacctsel_src_crmacct_id)
                     JOIN crmacct dest ON (crmacctsel_dest_crmacct_id=dest.crmacct_id)
                    WHERE ((src.crmacct_id='  || pSourceId || ')
                       AND (dest.crmacct_id=' || pTargetId || '))' INTO _hassubtype;

          IF (_hassubtype) THEN
            RAISE EXCEPTION 'Cannot merge CRM Accounts until the % child records have been merged [xtuple: merge, -7, %, %, %]',
                            _colname, _colname, pSourceId, pTargetId;
          END IF;

        END IF;

        /* clearing the source separately from setting the target avoids
           problems with triggers updating the wrong records */
        EXECUTE 'SELECT ' || quote_ident(_colname) || ' FROM crmacct
                  WHERE crmacct_id=' || pSourceId
        INTO _tmpid;

        -- now we have the data to back up the source
        IF (NOT _purge) THEN
          BEGIN
            EXECUTE 'INSERT INTO mrgundo (
                         mrgundo_schema,      mrgundo_table,
                         mrgundo_pkey_col,    mrgundo_pkey_id,
                         mrgundo_col,         mrgundo_value,      mrgundo_type,
                         mrgundo_base_schema, mrgundo_base_table, mrgundo_base_id
                   ) SELECT ''public'',     ''crmacct'',
                            ''crmacct_id'', crmacct_id, '   ||
                            quote_literal(_colname)         || ', ' ||
                            quote_ident(_colname)           || ', ' ||
                            quote_literal(_coldesc.typname) || ',
                            ''public'', ''crmacct'', '      || pTargetId || '
                       FROM crmacct
                      WHERE (crmacct_id=' || pSourceId || ');' ;
          EXCEPTION WHEN unique_violation THEN
            RAISE EXCEPTION 'Could not make a backup copy of % when merging % into % [xtuple: merge, -8, %, %, public, crmacct, %]',
                         _colname, pSourceId, pTargetId,
                         _colname, pSourceId, pTargetId;
          END;
        END IF;

        EXECUTE 'UPDATE crmacct SET ' || quote_ident(_colname) || '=NULL
              WHERE (crmacct_id=' || pSourceId || ');';

        EXECUTE 'UPDATE crmacct
                    SET ' || quote_ident(_colname) || '=' || quote_literal(_tmpid) || '
              WHERE (crmacct_id=' || pTargetId || ');';

      ELSE
        EXECUTE 'UPDATE crmacct dest
                    SET '      || quote_ident(_colname) || '
                        =src.' || quote_ident(_colname) || '
                  FROM crmacct src
                 WHERE ((dest.crmacct_id=' || pTargetId || ')
                    AND (src.crmacct_id='  || pSourceId || '));';
      END IF;

      GET DIAGNOSTICS _count = ROW_COUNT;
      _result := _result + _count;
    END IF;

  END LOOP;

  IF (_purge) THEN
    DELETE FROM crmacct WHERE crmacct = pSourceId;
  ELSE
    INSERT INTO mrgundo (
           mrgundo_schema,      mrgundo_table,
           mrgundo_pkey_col,    mrgundo_pkey_id,
           mrgundo_col,         mrgundo_value,      mrgundo_type,
           mrgundo_base_schema, mrgundo_base_table, mrgundo_base_id
    ) SELECT 'public',         'crmacct',
             'crmacct_id',     pSourceId,
             'crmacct_active', crmacct_active, 'bool',
             'public',         'crmacct',       pTargetId
        FROM crmacct
       WHERE crmacct_active AND (crmacct_id = pSourceId);
    GET DIAGNOSTICS _count = ROW_COUNT;
    IF (_count > 0) THEN
      _result := _result + _count;
      UPDATE crmacct SET crmacct_active = false WHERE (crmacct_id=pSourceId);
    END IF;

    -- make a special record of the source crm account so we can delete it later
    INSERT INTO mrgundo (
           mrgundo_schema,      mrgundo_table,
           mrgundo_pkey_col,    mrgundo_pkey_id,
           mrgundo_col,         mrgundo_value,      mrgundo_type,
           mrgundo_base_schema, mrgundo_base_table, mrgundo_base_id
     ) VALUES (
           'public',     'crmacct',
           'crmacct_id', pSourceId,
           NULL,         NULL,       NULL,
           'public',     'crmacct', pTargetId);
  END IF;

  DELETE FROM crmacctsel WHERE (crmacctsel_src_crmacct_id=pSourceId);

  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';

COMMENT ON FUNCTION merge2crmaccts(INTEGER, INTEGER, BOOLEAN) IS
'This function merges two crmacct records as decribed in crmacctsel records. For each field in the crmacctsel record marked TRUE, the data are copied from the crmacct record with crmacct_id=pSourceId to the record with crmacct_id=pTargetId. If the purge argument is TRUE, the source record is deleted. If it is FALSE, then mrgundo records are created so the merge can later be undone.';
