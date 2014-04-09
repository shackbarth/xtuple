CREATE OR REPLACE FUNCTION replaceAllVoidedAPChecks(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RAISE NOTICE ''replaceAllVoidedAPChecks() is deprecated - use replaceAllVoidedChecks() instead'';
  RETURN replaceAllVoidedChecks($1);
END;
' LANGUAGE 'plpgsql';
