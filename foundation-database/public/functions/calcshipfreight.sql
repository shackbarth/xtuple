
CREATE OR REPLACE FUNCTION calcShipFreight(integer) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pShipheadId ALIAS FOR $1;
  _result NUMERIC := 0;
  _order RECORD;
  _shipment RECORD;
  _weights RECORD;
  _price RECORD;
  _sales RECORD;
  _freightid INTEGER;
  _totalprice NUMERIC;
  _includepkgweight BOOLEAN := FALSE;
  _freight RECORD;
  _debug BOOLEAN := false;
BEGIN
  --Get shipment
  SELECT shiphead_order_id, shiphead_order_type, shiphead_freight 
  INTO _shipment
  FROM shiphead
  WHERE (shiphead_id=pShipheadId);

  IF (NOT FOUND) THEN
    RAISE EXCEPTION 'Shipment not found';
  END IF;

  IF (_shipment.shiphead_order_type = 'SO') THEN
  --Sales Orders
  
  --Get the order header information
    SELECT cust_id AS cust_id,
           custtype_id,
           custtype_code,
           shipto_id,
           shipto_num,
           cohead_orderdate AS orderdate,
           cohead_shipvia AS shipvia,
           shipto_shipzone_id AS shipzone_id,
           cohead_curr_id AS curr_id,
           currConcat(cohead_curr_id) AS currAbbr,
           cohead_calcfreight,
           cohead_freight
    INTO _order
    FROM cohead 
      JOIN custinfo ON (cust_id=cohead_cust_id)
      JOIN custtype ON (custtype_id=cust_custtype_id)
      LEFT OUTER JOIN shiptoinfo ON (shipto_id=cohead_shipto_id)
    WHERE (cohead_id=_shipment.shiphead_order_id);

    IF (NOT FOUND) THEN
      RAISE EXCEPTION 'Order not found';
    END IF;

    IF (_debug) THEN
      RAISE NOTICE 'cust_id = %', _order.cust_id;
      RAISE NOTICE 'custtype_id = %', _order.custtype_id;
      RAISE NOTICE 'shipto_id = %', _order.shipto_id;
      RAISE NOTICE 'shipto_num = %', _order.shipto_num;
      RAISE NOTICE 'orderdate = %', _order.orderdate;
      RAISE NOTICE 'shipvia = %', _order.shipvia;
      RAISE NOTICE 'shipzone_id = %', _order.shipzone_id;
      RAISE NOTICE 'curr_id = %', _order.curr_id;
      RAISE NOTICE 'currAbbr = %', _order.currAbbr;
      RAISE NOTICE 'calcfreight = %', _order.cohead_calcfreight;
      RAISE NOTICE 'freight = %', _order.cohead_freight;
    END IF;

    IF (NOT _order.cohead_calcfreight) THEN
      SELECT noNeg( _order.cohead_freight -
                    COALESCE((SELECT SUM(shiphead_freight)
                              FROM shiphead
                              WHERE (shiphead_order_id = _shipment.shiphead_order_id)
                                AND (shiphead_shipped='true')), 0) ) INTO _result;
      RETURN _result;
    END IF;

    SELECT fetchMetricBool('IncludePackageWeight') INTO _includepkgweight;

    --Calculate Sales Order freight
    --Get a list of aggregated weights from sites and
    --freight classes used on order lines
    FOR _weights IN
      SELECT CASE WHEN (_includePkgWeight) THEN
                        SUM(shipitem_qty * (item_prodweight + item_packweight))
                  ELSE  SUM(shipitem_qty * item_prodweight)
             END AS weight,
             itemsite_warehous_id, item_freightclass_id
      FROM shiphead
        JOIN shipitem ON (shipitem_shiphead_id=shiphead_id)
        JOIN coitem ON (shipitem_orderitem_id=coitem_id)
        JOIN itemsite ON (itemsite_id=coitem_itemsite_id)
        JOIN item ON (item_id=itemsite_item_id)
      WHERE ( (shiphead_id=pShipheadId)
        AND   (item_freightclass_id IS NOT NULL) )
      GROUP BY itemsite_warehous_id, item_freightclass_id LOOP

    IF (_debug) THEN
      RAISE NOTICE '_weights.weight - %', _weights.weight;
      RAISE NOTICE '_weights.itemsite_warehous_id = %', _weights.itemsite_warehous_id;
      RAISE NOTICE '_weights.item_freightclass_id = %', _weights.item_freightclass_id;
    END IF;

    -- First get a sales price if any so we when we find other prices
    -- we can determine if we want that price or this price.
    --  Check for a Sale Price
    SELECT ipsfreight_id,
           CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, _order.curr_id,
                                                           ipsfreight_price, _order.orderdate)
                ELSE currToCurr(ipshead_curr_id, _order.curr_id,
                                (_weights.weight * ipsfreight_price), _order.orderdate)
           END AS price
           INTO _sales
    FROM ipsfreight JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
                    JOIN sale ON (sale_ipshead_id=ipshead_id)
    WHERE ( (ipsfreight_qtybreak <= _weights.weight)
      AND   ((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=_weights.itemsite_warehous_id))
      AND   ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=_weights.item_freightclass_id))
      AND   ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=_order.shipzone_id))
      AND   ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=_order.shipvia))
      AND   (CURRENT_DATE BETWEEN sale_startdate AND sale_enddate) )
    ORDER BY ipsfreight_qtybreak DESC, price ASC
    LIMIT 1;

    IF (_debug) THEN
      IF (_sales.price IS NOT NULL) THEN
        RAISE NOTICE 'Sales Price found, %', _sales.price;
      END IF;
    END IF;

    --  Check for a Customer Shipto Price
    SELECT ipsfreight_id,
           CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, _order.curr_id,
                                                           ipsfreight_price, _order.orderdate)
                ELSE currToCurr(ipshead_curr_id, _order.curr_id,
                                (_weights.weight * ipsfreight_price), _order.orderdate)
           END AS price
           INTO _price
    FROM ipsfreight JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
                    JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
    WHERE ( (ipsfreight_qtybreak <= _weights.weight)
      AND   ((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=_weights.itemsite_warehous_id))
      AND   ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=_weights.item_freightclass_id))
      AND   ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=_order.shipzone_id))
      AND   ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=_order.shipvia))
      AND   (CURRENT_DATE BETWEEN ipshead_effective AND (ipshead_expires - 1))
      AND   (ipsass_cust_id=_order.cust_id)
      AND   (ipsass_shipto_id != -1)
      AND   (ipsass_shipto_id=_order.shipto_id) )
    ORDER BY ipsfreight_qtybreak DESC, price ASC
    LIMIT 1;

    IF (_debug) THEN
      IF (_price.price IS NOT NULL) THEN
        RAISE NOTICE 'Customer Shipto Price found, %', _price.price;
      END IF;
    END IF;

    IF (_price.price IS NULL) THEN
    --  Check for a Customer Shipto Pattern Price
      SELECT ipsfreight_id,
             CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, _order.curr_id,
                                                             ipsfreight_price, _order.orderdate)
                  ELSE currToCurr(ipshead_curr_id, _order.curr_id,
                                  (_weights.weight * ipsfreight_price), _order.orderdate)
             END AS price
             INTO _price
      FROM ipsfreight JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
                      JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
      WHERE ( (ipsfreight_qtybreak <= _weights.weight)
        AND   (CURRENT_DATE BETWEEN ipshead_effective AND (ipshead_expires - 1))
        AND   (ipsass_cust_id=_order.cust_id)
        AND   (COALESCE(LENGTH(ipsass_shipto_pattern), 0) > 0)
        AND   (_order.shipto_num ~ ipsass_shipto_pattern)
        AND   ((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=_weights.itemsite_warehous_id))
        AND   ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=_weights.item_freightclass_id))
        AND   ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=_order.shipzone_id))
        AND   ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=_order.shipvia)) )
      ORDER BY ipsfreight_qtybreak DESC, price ASC
      LIMIT 1;

      IF (_debug) THEN
        IF (_price.price IS NOT NULL) THEN
          RAISE NOTICE 'Customer Shipto Pattern Price found, %', _price.price;
        END IF;
      END IF;

    END IF;

    IF (_price.price IS NULL) THEN
    --  Check for a Customer Price
      SELECT ipsfreight_id,
             CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, _order.curr_id,
                                                             ipsfreight_price, _order.orderdate)
                  ELSE currToCurr(ipshead_curr_id, _order.curr_id,
                                  (_weights.weight * ipsfreight_price), _order.orderdate)
             END AS price
             INTO _price
      FROM ipsfreight JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
                      JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
      WHERE ( (ipsfreight_qtybreak <= _weights.weight)
        AND   ((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=_weights.itemsite_warehous_id))
        AND   ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=_weights.item_freightclass_id))
        AND   ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=_order.shipzone_id))
        AND   ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=_order.shipvia))
        AND   (CURRENT_DATE BETWEEN ipshead_effective AND (ipshead_expires - 1))
        AND   (ipsass_cust_id=_order.cust_id)
        AND   (COALESCE(LENGTH(ipsass_shipto_pattern), 0) = 0) )
      ORDER BY ipsfreight_qtybreak DESC, price ASC
      LIMIT 1;

      IF (_debug) THEN
        IF (_price.price IS NOT NULL) THEN
          RAISE NOTICE 'Customer Price found, %', _price.price;
        END IF;
      END IF;

    END IF;

    IF (_price.price IS NULL) THEN
    --  Check for a Customer Type Price
      SELECT ipsfreight_id,
             CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, _order.curr_id,
                                                             ipsfreight_price, _order.orderdate)
                  ELSE currToCurr(ipshead_curr_id, _order.curr_id,
                                  (_weights.weight * ipsfreight_price), _order.orderdate)
             END AS price
             INTO _price
      FROM ipsfreight JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
                      JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
      WHERE ( (ipsfreight_qtybreak <= _weights.weight)
        AND   ((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=_weights.itemsite_warehous_id))
        AND   ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=_weights.item_freightclass_id))
        AND   ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=_order.shipzone_id))
        AND   ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=_order.shipvia))
        AND   (CURRENT_DATE BETWEEN ipshead_effective AND (ipshead_expires - 1))
        AND   (ipsass_custtype_id=_order.custtype_id) )
      ORDER BY ipsfreight_qtybreak DESC, price ASC
      LIMIT 1;

      IF (_debug) THEN
        IF (_price.price IS NOT NULL) THEN
          RAISE NOTICE 'Customer Type Price found, %', _price.price;
        END IF;
      END IF;

    END IF;

    IF (_price.price IS NULL) THEN
    --  Check for a Customer Type Pattern Price
      SELECT ipsfreight_id,
             CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, _order.curr_id,
                                                             ipsfreight_price, _order.orderdate)
                  ELSE currToCurr(ipshead_curr_id, _order.curr_id,
                                  (_weights.weight * ipsfreight_price), _order.orderdate)
             END AS price
             INTO _price
      FROM ipsfreight JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
                      JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
      WHERE ( (ipsfreight_qtybreak <= _weights.weight)
        AND   ((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=_weights.itemsite_warehous_id))
        AND   ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=_weights.item_freightclass_id))
        AND   ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=_order.shipzone_id))
        AND   ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=_order.shipvia))
        AND   (CURRENT_DATE BETWEEN ipshead_effective AND (ipshead_expires - 1))
        AND   (COALESCE(LENGTH(ipsass_custtype_pattern), 0) > 0)
        AND   (_order.custtype_code ~ ipsass_custtype_pattern) )
      ORDER BY ipsfreight_qtybreak DESC, price ASC
      LIMIT 1;

      IF (_debug) THEN
        IF (_price.price IS NOT NULL) THEN
          RAISE NOTICE 'Customer Type Pattern Price found, %', _price.price;
        END IF;
      END IF;

    END IF;

    -- Select the lowest price  
    IF ( (_price.price IS NOT NULL) AND ((_sales.price IS NULL) OR (_price.price < _sales.price)) ) THEN
      _freightid := _price.ipsfreight_id;
      _totalprice := _price.price;
    ELSE
      IF ( (_sales.price IS NOT NULL) AND ((_price.price IS NULL) OR (_sales.price <= _price.price)) ) THEN
        _freightid := _sales.ipsfreight_id;
        _totalprice := _sales.price;
      END IF;
    END IF;

    -- Total
    IF (_freightid IS NOT NULL) THEN
      _result := _result + _totalprice;
    END IF;

    END LOOP;
    RETURN ROUND(_result,2);
  END IF;

  IF (_shipment.shiphead_order_type = 'TO') THEN
  --Transfer Orders
  
    SELECT noNeg( (SELECT SUM(toitem_freight) + tohead_freight
                   FROM tohead, toitem
                   WHERE (toitem_tohead_id=tohead_id)
                     AND (tohead_id = _shipment.shiphead_order_id)
                   GROUP BY tohead_freight) -
                  COALESCE((SELECT SUM(shiphead_freight)
                            FROM shiphead
                            WHERE (shiphead_order_id = _shipment.shiphead_order_id)
                              AND (shiphead_shipped='true')), 0) ) INTO _result;
    RETURN _result;
  END IF;

  RETURN _result;

END;
$$ LANGUAGE 'plpgsql';
