CREATE OR REPLACE FUNCTION postPoReceipts(INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN postReceipts(''PO'', $1, NULL);
END;
' LANGUAGE 'plpgsql';
