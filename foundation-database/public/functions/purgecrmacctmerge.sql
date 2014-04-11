CREATE OR REPLACE FUNCTION purgecrmacctmerge(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pDestid       ALIAS FOR $1;
  _result       INTEGER := 0;
  _tmpcount     INTEGER := 0;
BEGIN
  IF EXISTS(SELECT 1
              FROM crmacctsel
             WHERE crmacctsel_dest_crmacct_id=pDestid) THEN
    DELETE FROM crmacctsel WHERE crmacctsel_dest_crmacct_id = pDestid;
    GET DIAGNOSTICS _result = ROW_COUNT;

  ELSIF EXISTS(SELECT 1
                 FROM mrgundo
                WHERE mrgundo_base_schema='public'
                  AND mrgundo_base_table='crmacct'
                  AND mrgundo_base_id=pDestid) THEN

    DELETE FROM crmacct
     WHERE crmacct_id IN (
              SELECT mrgundo_pkey_id
                FROM mrgundo
               WHERE mrgundo_schema   = 'public'
                 AND mrgundo_table    = 'crmacct'
                 and mrgundo_pkey_col = 'crmacct_id'
                 AND mrgundo_col IS NULL
                 AND mrgundo_base_schema = 'public'
                 AND mrgundo_base_table  = 'crmacct'
                 AND mrgundo_base_id     = pDestid)
        AND crmacct_id != pDestid;
    GET DIAGNOSTICS _result = ROW_COUNT;

    DELETE FROM mrgundo
     WHERE mrgundo_base_schema ='public'
       AND mrgundo_base_table  ='crmacct'
       AND mrgundo_base_id     = pDestid;
    GET DIAGNOSTICS _tmpcount = ROW_COUNT;

    _result := _result + _tmpcount;
  END IF;

  RETURN _result;
END;
$$ LANGUAGE 'plpgsql';
