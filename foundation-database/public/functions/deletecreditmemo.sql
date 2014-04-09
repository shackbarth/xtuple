CREATE OR REPLACE FUNCTION deleteCreditMemo(INTEGER) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCmheadid ALIAS FOR $1;

BEGIN

  DELETE FROM cmitem
  WHERE (cmitem_cmhead_id=pCmheadid);

  DELETE FROM cmhead
  WHERE (cmhead_id=pCmheadid);

  RETURN TRUE;

END;
' LANGUAGE 'plpgsql';
