CREATE OR REPLACE FUNCTION unreleasePurchaseOrder(pPoheadid INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN

  IF ( ( SELECT (COUNT(*) > 0)
         FROM poitem LEFT OUTER JOIN recv ON (recv_order_type='PO' AND
                                              recv_orderitem_id=poitem_id)
         WHERE ( (poitem_pohead_id=pPoheadid)
           AND   ( (poitem_status='C') OR
                   (poitem_qty_received > 0.0) OR
                   (poitem_qty_returned > 0.0) OR
                   (poitem_qty_vouchered > 0.0) OR
                   (recv_id IS NOT NULL) ) ) ) ) THEN
    RETURN -1;
  END IF;

  IF ( ( SELECT (pohead_status='O')
         FROM pohead
         WHERE (pohead_id=pPoheadid) ) ) THEN

    --update status and erase the date that the order was released on
    UPDATE pohead
    SET pohead_status='U', pohead_released = NULL
    WHERE (pohead_id=pPoheadid);

  END IF;

  --update status and erase the duedates at release
  UPDATE poitem
  SET poitem_status='U', poitem_rlsd_duedate = NULL
  WHERE (poitem_pohead_id=pPoheadid);

  RETURN 1;

END;
$$ LANGUAGE 'plpgsql';
