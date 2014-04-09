CREATE OR REPLACE FUNCTION createMiscAPCheck(INTEGER, INTEGER, DATE, NUMERIC, INTEGER, TEXT, TEXT) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RAISE NOTICE ''createMiscAPCheck() is deprecated - use createCheck() instead'';
  RETURN createCheck($1, ''V'', $2, $3, $4, baseCurrId(), $5, NULL, $6, $7, FALSE);
END;
' LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION createMiscAPCheck(INTEGER, INTEGER, DATE, NUMERIC, INTEGER, INTEGER, TEXT, TEXT) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RAISE NOTICE ''createMiscAPCheck() is deprecated - use createCheck() instead'';
  RETURN createCheck($1, ''V'', $2, $3, pAmount, $5, $6, NULL, $7, $8, FALSE);
END;
' LANGUAGE 'plpgsql';
