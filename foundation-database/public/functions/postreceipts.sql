CREATE OR REPLACE FUNCTION postReceipts(TEXT, INTEGER, INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pordertype		ALIAS FOR $1;
  porderid		ALIAS FOR $2;
  _itemlocSeries	INTEGER	:= $3;
  _qtyToRecv		NUMERIC;
  _r			RECORD;

BEGIN

  SELECT SUM(qtyToReceive(pordertype, recv_orderitem_id)) INTO _qtyToRecv
  FROM recv, orderitem
  WHERE ((recv_orderitem_id=orderitem_id)
    AND  (recv_order_type=pordertype)
    AND  (orderitem_orderhead_type=pordertype)
    AND  (orderitem_orderhead_id=porderid));

  IF (_qtyToRecv <= 0) THEN
    RETURN -11;
  END IF;

  IF (_itemlocSeries IS NULL OR _itemlocSeries <= 0) THEN
    _itemlocSeries := NEXTVAL('itemloc_series_seq');
  END IF;

  FOR _r IN SELECT postReceipt(recv_id, _itemlocSeries) AS postResult
	    FROM recv, orderitem
	    WHERE ((recv_orderitem_id=orderitem_id)
	      AND  (orderitem_orderhead_id=porderid)
	      AND  (orderitem_orderhead_type=pordertype)
	      AND  (NOT recv_posted)
-- Check for multiple users receiving the same order
              AND  (recv_trans_usr_name=getEffectiveXtUser())
	      AND  (recv_order_type=pordertype)) LOOP
    IF (_r.postResult < 0 AND _r.postResult != -11) THEN
      RETURN _r.postResult; -- fail on 1st error but ignore lines with qty == 0
    END IF;
  END LOOP;

  RETURN _itemlocSeries;
END;
$$ LANGUAGE 'plpgsql';
