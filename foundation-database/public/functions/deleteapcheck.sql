CREATE OR REPLACE FUNCTION deleteAPCheck(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RAISE NOTICE ''deleteAPCheck() is deprecated - use deleteCheck() instead'';
  RETURN deleteCheck($1);
END;
' LANGUAGE 'plpgsql';
