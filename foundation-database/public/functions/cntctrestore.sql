CREATE OR REPLACE FUNCTION cntctrestore(integer) RETURNS boolean AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCntctId ALIAS FOR $1;
  _r RECORD;
  _qry TEXT;

BEGIN
  -- Validate
  SELECT * INTO _r FROM cntctmrgd WHERE (cntctmrgd_cntct_id=pCntctId);
  IF (NOT FOUND) THEN
    RETURN false;
  END IF;
  
  -- Gather the list of affected records
  FOR _r IN
    SELECT * FROM mrghist
    WHERE (mrghist_cntct_id=pCntctId)
  LOOP
    -- Restore the old references
    _qry := 'UPDATE ' || _r.mrghist_table ||
            ' SET ' || _r.mrghist_cntct_col || '=' || pCntctId ||
            ' WHERE (' || _r.mrghist_pkey_col || '=' || _r.mrghist_pkey_id || ');';
    
   EXECUTE _qry;
         
  END LOOP;

  -- Gather the list of affected fields
  FOR _r IN
    SELECT * FROM trgthist
    WHERE (trgthist_src_cntct_id=pCntctId)
  LOOP
    -- Restore the old values
    _qry := 'UPDATE cntct
              SET ' || _r.trgthist_col || '=' || _r.trgthist_value ||
            ' WHERE (cntct_id=' || _r.trgthist_trgt_cntct_id || ');';
    
   EXECUTE _qry;
         
  END LOOP;

  -- Clean up
  UPDATE cntct SET cntct_active=true WHERE (cntct_id=pCntctId);
  DELETE FROM mrghist WHERE (mrghist_cntct_id=pCntctId);
  DELETE FROM trgthist WHERE (trgthist_src_cntct_id=pCntctId);
  DELETE FROM cntctmrgd WHERE (cntctmrgd_cntct_id=pCntctId);

  RETURN true;

END;
$$ LANGUAGE 'plpgsql';
