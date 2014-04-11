CREATE OR REPLACE FUNCTION getOpenShipment(pOrderType TEXT,
                                           pOrderId INTEGER,
                                           pWarehousId INTEGER) RETURNS TEXT AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result TEXT := '';

BEGIN

  IF (pOrderType = 'SO') THEN
    SELECT shiphead_number INTO _result
    FROM shiphead JOIN shipitem ON (shipitem_shiphead_id=shiphead_id)
                  JOIN coitem ON (coitem_id=shipitem_orderitem_id)
                  JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
    WHERE (shiphead_order_id=pOrderId)
      AND (shiphead_order_type='SO') 
      AND (NOT shiphead_shipped)
      AND (CASE WHEN (pWarehousId IS NULL) THEN TRUE
                ELSE itemsite_warehous_id=pWarehousId END) 
    ORDER BY shiphead_number
    LIMIT 1; 
  ELSEIF (pOrderType = 'TO') THEN
    SELECT shiphead_number INTO _result
    FROM shiphead JOIN tohead ON (tohead_id=shiphead_order_id)
    WHERE (shiphead_order_id=pOrderId)
      AND (shiphead_order_type='TO') 
      AND (NOT shiphead_shipped)
      AND (CASE WHEN (pWarehousId IS NULL) THEN TRUE
                ELSE tohead_src_warehous_id=pWarehousId END) 
    ORDER BY shiphead_number
    LIMIT 1; 
  END IF;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql' STABLE;

CREATE OR REPLACE FUNCTION getOpenShipmentId(pOrderType TEXT,
                                             pOrderId INTEGER,
                                             pWarehousId INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result INTEGER := -1;

BEGIN

  IF (pOrderType = 'SO') THEN
    SELECT shiphead_id INTO _result
    FROM shiphead JOIN shipitem ON (shipitem_shiphead_id=shiphead_id)
                  JOIN coitem ON (coitem_id=shipitem_orderitem_id)
                  JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
    WHERE (shiphead_order_id=pOrderId)
      AND (shiphead_order_type='SO') 
      AND (NOT shiphead_shipped)
      AND (CASE WHEN (pWarehousId IS NULL) THEN TRUE
                ELSE itemsite_warehous_id=pWarehousId END) 
    ORDER BY shiphead_number
    LIMIT 1; 
  ELSEIF (pOrderType = 'TO') THEN
    SELECT shiphead_id INTO _result
    FROM shiphead JOIN tohead ON (tohead_id=shiphead_order_id)
    WHERE (shiphead_order_id=pOrderId)
      AND (shiphead_order_type='TO') 
      AND (NOT shiphead_shipped)
      AND (CASE WHEN (pWarehousId IS NULL) THEN TRUE
                ELSE tohead_src_warehous_id=pWarehousId END) 
    ORDER BY shiphead_number
    LIMIT 1; 
  END IF;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql' STABLE;
