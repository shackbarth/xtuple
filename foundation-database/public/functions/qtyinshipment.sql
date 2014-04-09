CREATE OR REPLACE FUNCTION qtyInShipment(TEXT, INTEGER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pordertype	ALIAS FOR $1;
  plineitemid	ALIAS FOR $2;
  pshipheadid   ALIAS FOR $3;
  _qty NUMERIC;

BEGIN

  IF (pordertype NOT IN (''SO'', ''TO'')) THEN
    RAISE EXCEPTION ''% is not a valid order type'', pordertype;
  END IF;

  IF (pshipheadid IS NULL) THEN
    RAISE EXCEPTION ''Cannot calculate quantity in a shipment with a NULL shipment'';
  END IF;

  SELECT SUM(COALESCE(shipitem_qty, 0.0)) INTO _qty
  FROM shipitem, shiphead
  WHERE ((shipitem_shiphead_id=shiphead_id)
      AND (shiphead_order_type=pordertype)
      AND (shipitem_orderitem_id=plineitemid)
      AND (shiphead_id=pshipheadid));

  IF (NOT FOUND) THEN
    RAISE NOTICE ''Quantity of % item % is 0 because shipment % does not exist.'',
                  pordertype, plineitemid, pshipheadid;
  END IF;

  RETURN _qty;

END;
' LANGUAGE 'plpgsql';
