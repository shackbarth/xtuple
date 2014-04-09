CREATE OR REPLACE FUNCTION apCheckPending(INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pApopenid	ALIAS FOR $1;
  _qty NUMERIC  := 0.0;

BEGIN

  SELECT SUM(checkitem_amount + checkitem_discount) INTO _qty
    FROM checkitem JOIN checkhead ON (checkitem_checkhead_id=checkhead_id)
   WHERE ((checkitem_apopen_id=pApopenid)
     AND (NOT checkhead_deleted)
     AND (NOT checkhead_replaced)
     AND (NOT checkhead_void)
     AND (NOT checkhead_posted));

  RETURN COALESCE(_qty, 0.0);

END;
$$ LANGUAGE 'plpgsql' STABLE;
