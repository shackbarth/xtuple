CREATE OR REPLACE FUNCTION splitReceipt(INTEGER, NUMERIC, NUMERIC) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  precvid	ALIAS FOR $1;
  pqty   	ALIAS FOR $2;
  pfreight	ALIAS FOR $3;
  _check       	RECORD;
  _seq      	INTEGER;

BEGIN
  -- validate
  IF (COALESCE(pQty,0) <= 0) THEN
    RETURN -7;
  END IF;
  
  SELECT * INTO _check
  FROM recv
  WHERE (recv_id=precvid);

  IF (FOUND) THEN
    IF (_check.recv_order_type != ''PO'') THEN
      RETURN -1;
    ELSIF ( NOT _check.recv_posted) THEN
      RETURN -2;
    ELSIF ( (_check.recv_invoiced)
         OR (_check.recv_vohead_id IS NOT NULL)
         OR (_check.recv_voitem_id IS NOT NULL) ) THEN
      RETURN -3;
    ELSIF (pqty >= _check.recv_qty) THEN
      RETURN -4;
    ELSIF (COALESCE(pfreight,0) > _check.recv_freight) THEN
      RETURN -5;
    END IF;
  ELSE
    RETURN -6;
  END IF;

  -- Create new receipt record
  _seq := nextval(''recv_recv_id_seq'');
  
  INSERT INTO recv
  SELECT _seq, recv_order_type,recv_order_number,
         recv_orderitem_id, recv_agent_username, recv_itemsite_id, recv_vend_id,
         recv_vend_item_number, recv_vend_item_descrip, recv_vend_uom,
         recv_purchcost, recv_purchcost_curr_id, recv_duedate, pqty, 
         recv_recvcost, recv_recvcost_curr_id, COALESCE(pfreight,0), recv_freight_curr_id, recv_date, 
         ROUND(recv_value/recv_qty * pqty, 2), TRUE, FALSE, NULL, NULL,
         recv_trans_usr_name, recv_notes, recv_gldistdate, precvid
  FROM recv
  WHERE (recv_id=precvid);

  --  Update qty and value of old record
  UPDATE recv SET
    recv_qty = recv_qty-pqty,
    recv_value = recv_value - ROUND(recv_value/recv_qty * pqty, 2),
    recv_freight = recv_freight - COALESCE(pfreight,0)
  WHERE (recv_id=precvid);

  RETURN _seq;
END;
' LANGUAGE 'plpgsql';
