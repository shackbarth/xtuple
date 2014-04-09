CREATE OR REPLACE FUNCTION undomerge(TEXT, TEXT, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSchema       ALIAS FOR $1;
  pTable        ALIAS FOR $2;
  pId           ALIAS FOR $3;
  _qry          TEXT;
  _r            RECORD;
  _result       INTEGER;

BEGIN
  FOR _r IN
    SELECT *
      FROM mrgundo
     WHERE mrgundo_base_schema = pSchema
       AND mrgundo_base_table  = pTable
       AND mrgundo_base_id     = pId
       AND mrgundo_col IS NOT NULL  -- NULL mrgundo_col signals a row to delete on purge
  LOOP
    IF (_r.mrgundo_value IS NULL) THEN
      _qry := 'UPDATE ' || quote_ident(_r.mrgundo_schema)  ||
                    '.' || quote_ident(_r.mrgundo_table)   ||
                ' SET ' || quote_ident(_r.mrgundo_col)     || '= NULL
               WHERE (' || _r.mrgundo_pkey_col || '=' || _r.mrgundo_pkey_id || ');';
    ELSE
      _qry := 'UPDATE ' || quote_ident(_r.mrgundo_schema)  ||
                    '.' || quote_ident(_r.mrgundo_table)   ||
                ' SET ' || quote_ident(_r.mrgundo_col)     ||
              '= CAST(' || quote_literal(_r.mrgundo_value) || ' AS '
                        || quote_ident(_r.mrgundo_type)    || ')
               WHERE (' || _r.mrgundo_pkey_col || '=' || _r.mrgundo_pkey_id || ');';
    END IF;

    EXECUTE _qry;
  END LOOP;

  DELETE FROM mrgundo
   WHERE mrgundo_base_schema = pSchema
     AND mrgundo_base_table  = pTable
     AND mrgundo_base_id     = pId;

  GET DIAGNOSTICS _result = ROW_COUNT;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';

