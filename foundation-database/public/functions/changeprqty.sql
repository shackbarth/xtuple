CREATE OR REPLACE FUNCTION changePrQty(INTEGER, NUMERIC) RETURNS BOOL AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPrid ALIAS FOR $1;
  pQty ALIAS FOR $2;

BEGIN

  UPDATE pr
  SET pr_qtyreq=pQty
  WHERE (pr_id=pPrid);

  RETURN TRUE;

END;
' LANGUAGE 'plpgsql';
