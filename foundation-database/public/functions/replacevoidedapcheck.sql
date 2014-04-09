CREATE OR REPLACE FUNCTION replaceVoidedAPCheck(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RAISE NOTICE ''replaceVoidedAPCheck() is deprecated - use replaceVoidedCheck()'';
  RETURN replaceVoidedCheck($1);
END;
' LANGUAGE 'plpgsql';
