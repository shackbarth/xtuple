CREATE OR REPLACE FUNCTION deleteRecvForOrder(TEXT, INTEGER) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pordertype	ALIAS FOR $1;
  porderid	ALIAS FOR $2;

BEGIN
  DELETE FROM recv
  USING orderitem
  WHERE ((recv_orderitem_id=orderitem_id)
    AND  (recv_order_type=orderitem_orderhead_type)
    AND  (NOT recv_posted)
    AND  (orderitem_orderhead_id=porderid)
    AND  (orderitem_orderhead_type=pordertype));

  RETURN 0;

END;
' LANGUAGE 'plpgsql';
