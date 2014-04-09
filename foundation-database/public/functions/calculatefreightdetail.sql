
CREATE OR REPLACE FUNCTION calculateFreightDetail(integer,integer,text,integer,integer,text,date,text,integer,character varying,integer,integer,numeric)
  RETURNS SETOF freightData AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustId ALIAS FOR $1;
  pCustTypeId ALIAS FOR $2;
  pCustTypeCode ALIAS FOR $3;
  pShiptoId ALIAS FOR $4;
  pShipZoneId ALIAS FOR $5;
  pShiptoNum ALIAS FOR $6;
  pOrderDate ALIAS FOR $7;
  pShipVia ALIAS FOR $8;
  pCurrId ALIAS FOR $9;
  pCurrAbbr ALIAS FOR $10;
  pItemSiteWhsId ALIAS FOR $11;
  pItemFreightclassId ALIAS FOR $12;
  pWeight ALIAS FOR $13;

  _row freightData%ROWTYPE;
  _price RECORD;
  _sales RECORD;
  _freightid INTEGER;
  _totalprice NUMERIC;
  _asof DATE;
  _debug BOOLEAN := FALSE;

BEGIN

  --Get pricing effectivity metric
  IF (SELECT fetchMetricText('soPriceEffective') = 'OrderDate') THEN
    _asof := pOrderDate;
  ELSE
    _asof := CURRENT_DATE;
  END IF;

  _freightid := NULL;
  _totalprice := 0.0;

  IF (_debug) THEN
    RAISE NOTICE 'pWeight - %', pWeight;
    RAISE NOTICE 'pItemSiteWhsId = %', pItemSiteWhsId;
    RAISE NOTICE 'pItemFreightclassId = %', pItemFreightclassId;
  END IF;

-- First get a sales price if any so when we find other prices
-- we can determine if we want that price or this sales price.
--  Check for a Sale Price
  SELECT ipsfreight_id,
    CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, pCurrId,
        ipsfreight_price, pOrderDate)
      ELSE currToCurr(ipshead_curr_id, pCurrId,
        (pWeight * ipsfreight_price), pOrderDate)
    END AS price
  INTO _sales
  FROM ipsfreight
  JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
  JOIN sale ON (sale_ipshead_id=ipshead_id)
  WHERE ( (ipsfreight_qtybreak <= pWeight)
    AND ((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=pItemSiteWhsId))
    AND ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=pItemFreightclassId))
    AND ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=pShipZoneId))
    AND ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=pShipVia))
    AND (_asof BETWEEN sale_startdate AND sale_enddate)
    AND (pCustId IS NOT NULL) )
  ORDER BY ipsfreight_qtybreak DESC, price ASC
  LIMIT 1;

  IF (_debug) THEN
    IF (_sales.price IS NOT NULL) THEN
      RAISE NOTICE 'Sales Price found, %', _sales.price;
    END IF;
  END IF;

--  Check for a Customer Shipto Price
  SELECT ipsfreight_id,
    CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, pCurrId,
        ipsfreight_price, pOrderDate)
      ELSE currToCurr(ipshead_curr_id, pCurrId,
        (pWeight * ipsfreight_price), pOrderDate)
    END AS price
  INTO _price
  FROM ipsfreight
  JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
  JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE ( (ipsfreight_qtybreak <= pWeight)
    AND ((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=pItemSiteWhsId))
    AND ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=pItemFreightclassId))
    AND ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=pShipZoneId))
    AND ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=pShipVia))
    AND (_asof BETWEEN ipshead_effective AND (ipshead_expires - 1))
    AND   (ipsass_shipto_id != -1)
    AND   (ipsass_shipto_id=pShiptoId) )
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
    CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, pCurrId,
        ipsfreight_price, pOrderDate)
      ELSE currToCurr(ipshead_curr_id, pCurrId,
        (pWeight * ipsfreight_price), pOrderDate)
    END AS price
  INTO _price
  FROM ipsfreight
  JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
  JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE ( (ipsfreight_qtybreak <= pWeight)
    AND (_asof BETWEEN ipshead_effective AND (ipshead_expires - 1))
    AND (ipsass_cust_id=pCustId)
    AND (COALESCE(LENGTH(ipsass_shipto_pattern), 0) > 0)
    AND (pShiptoNum ~ ipsass_shipto_pattern)
    AND ((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=pItemSiteWhsId))
    AND ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=pItemFreightclassId))
    AND ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=pShipZoneId))
    AND ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=pShipVia)) )
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
    CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, pCurrId,
        ipsfreight_price, pOrderDate)
      ELSE currToCurr(ipshead_curr_id, pCurrId,
        (pWeight * ipsfreight_price), pOrderDate)
    END AS price
  INTO _price
  FROM ipsfreight
  JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
  JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE ( (ipsfreight_qtybreak <= pWeight)
    AND((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=pItemSiteWhsId))
    AND ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=pItemFreightclassId))
    AND ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=pShipZoneId))
    AND ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=pShipVia))
    AND (_asof BETWEEN ipshead_effective AND (ipshead_expires - 1))
    AND (ipsass_cust_id=pCustId)
    AND (COALESCE(LENGTH(ipsass_shipto_pattern), 0) = 0) )
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
    CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, pCurrId,
        ipsfreight_price, pOrderDate)
      ELSE currToCurr(ipshead_curr_id, pCurrId,
        (pWeight * ipsfreight_price), pOrderDate)
    END AS price
  INTO _price
  FROM ipsfreight JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
                  JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE ( (ipsfreight_qtybreak <= pWeight)
    AND ((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=pItemSiteWhsId))
    AND ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=pItemFreightclassId))
    AND ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=pShipZoneId))
    AND ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=pShipVia))
    AND (_asof BETWEEN ipshead_effective AND (ipshead_expires - 1))
    AND (ipsass_custtype_id=pCustTypeId) )
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
    CASE WHEN (ipsfreight_type='F') THEN currToCurr(ipshead_curr_id, pCurrId,
        ipsfreight_price, pOrderDate)
      ELSE currToCurr(ipshead_curr_id, pCurrId,
        (pWeight * ipsfreight_price), pOrderDate)
    END AS price
  INTO _price
  FROM ipsfreight JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
                  JOIN ipsass ON (ipsass_ipshead_id=ipshead_id)
  WHERE ( (ipsfreight_qtybreak <= pWeight)
    AND ((ipsfreight_warehous_id IS NULL) OR (ipsfreight_warehous_id=pItemSiteWhsId))
    AND ((ipsfreight_freightclass_id IS NULL) OR (ipsfreight_freightclass_id=pItemFreightclassId))
    AND ((ipsfreight_shipzone_id IS NULL) OR (ipsfreight_shipzone_id=pShipZoneId))
    AND ((ipsfreight_shipvia IS NULL) OR (ipsfreight_shipvia=pShipVia))
    AND (_asof BETWEEN ipshead_effective AND (ipshead_expires - 1))
    AND (COALESCE(LENGTH(ipsass_custtype_pattern), 0) > 0)
    AND (pCustTypeCode ~ ipsass_custtype_pattern) )
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

  IF (_debug) THEN
    RAISE NOTICE '_freightid = %', _freightid;
    RAISE NOTICE '_totalprice = %', _totalprice;
  END IF;

  -- Get information for the selected ipsfreight
  -- and return
  IF (_freightid IS NULL) THEN
    _row.freightdata_schedule := 'N/A';
    _row.freightdata_from := '';
    _row.freightdata_to := '';
    _row.freightdata_shipvia := '';
    _row.freightdata_freightclass := '';
    _row.freightdata_weight := 0;
    _row.freightdata_uom := '';
    _row.freightdata_price := 0;
    _row.freightdata_type := '';
    _row.freightdata_total := 0;
    _row.freightdata_currency := '';
    RETURN NEXT _row;
  ELSE
    SELECT ipshead_name AS freightdata_schedule,
      COALESCE(warehous_code, 'Any') AS freightdata_from,
      COALESCE(shipzone_name, 'Any') AS freightdata_to,
      COALESCE(ipsfreight_shipvia, 'Any') AS freightdata_shipvia,
      COALESCE(freightclass_code, 'Any') AS freightdata_freightclass,
      pWeight AS freightdata_weight,
      uom_name AS freightdata_uom,
      currToCurr(ipshead_curr_id, pCurrId, ipsfreight_price, pOrderDate) AS freightdata_price,
      CASE WHEN (ipsfreight_type='F') THEN 'Flat Rate'
        ELSE 'Per UOM'
      END AS freightdata_type,
      _totalprice AS freightdata_total,
      pCurrAbbr AS freightdata_currency
    INTO _row
    FROM ipsfreight
      JOIN ipshead ON (ipshead_id=ipsfreight_ipshead_id)
      LEFT OUTER JOIN uom ON (uom_item_weight)
      LEFT OUTER JOIN whsinfo ON (warehous_id=ipsfreight_warehous_id)
      LEFT OUTER JOIN shipzone ON (shipzone_id=ipsfreight_shipzone_id)
      LEFT OUTER JOIN freightclass ON (freightclass_id=ipsfreight_freightclass_id)
    WHERE (ipsfreight_id=_freightid);

    RETURN NEXT _row;
  END IF;

  RETURN;
END;
$$ LANGUAGE 'plpgsql';

