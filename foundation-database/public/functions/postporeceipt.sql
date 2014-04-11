CREATE OR REPLACE FUNCTION postPoReceipt(INTEGER, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN postReceipt($1, $2);
END;
' LANGUAGE 'plpgsql';
