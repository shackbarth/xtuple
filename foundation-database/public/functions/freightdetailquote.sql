
CREATE OR REPLACE FUNCTION freightDetailQuote(integer,text,integer,text,date,text,text,text[][])
  RETURNS SETOF freightData AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustId ALIAS FOR $1;
  pCustNumber ALIAS FOR $2;
  pShiptoId ALIAS FOR $3;
  pShiptoNum ALIAS FOR $4;
  pOrderDate ALIAS FOR $5;
  pShipVia ALIAS FOR $6;
  pItemArrayType ALIAS FOR $7;
  pItemQty ALIAS FOR $8;
    -- Array item_id format = ARRAY[['300','3'],['310','50']]
    -- Array item_number format = ARRAY[['YTRUCK1','3'],['RTRUCK1','50']]
    -- Array itemsite_id format = ARRAY[['293','3'],['302','50']]

  _cust RECORD;
  _shipto RECORD;
  _curr RECORD;
  _includepkgweight BOOLEAN := FALSE;
  _order_date DATE;
  _ship_via TEXT;
  _item_num RECORD;
  _item_id RECORD;
  _weights RECORD;
  _row freightData%ROWTYPE;
  _debug BOOLEAN := FALSE;

BEGIN
-- Parameters are setup to allow this function to be called multiple ways.
-- Check parameters and lookup what is NULL.

  -- Check pCustId and pCustNumber.
  IF (pCustId IS NULL AND (pCustNumber IS NULL OR pCustNumber = '')) THEN
    RAISE EXCEPTION 'You must specify a Customer ID or Number to get a freight quote.';
  ELSIF (pCustId IS NULL AND pCustNumber IS NOT NULL) THEN
    -- Get customer info using pCustNumber.
    SELECT
      cust_id,
      cust_number,
      custtype_id,
      custtype_code,
      cust_curr_id,
      cust_shipvia
    INTO _cust
    FROM custinfo
    LEFT JOIN custtype ON cust_custtype_id = custtype_id
    WHERE 1=1
      AND cust_number = pCustNumber;
  ELSE
    -- Get customer info using pCustId.
    SELECT
      cust_id,
      cust_number,
      custtype_id,
      custtype_code,
      cust_curr_id,
      cust_shipvia
    INTO _cust
    FROM custinfo
    LEFT JOIN custtype ON cust_custtype_id = custtype_id
    WHERE 1=1
      AND cust_id = pCustId;
  END IF;

  IF(NOT FOUND) THEN
    RAISE EXCEPTION 'Invalid Customer specified when trying to get a freight quote.';
  END IF;

  -- Check pShiptoId and pShiptoNum.
  IF (pShiptoId IS NULL AND (pShiptoNum IS NULL OR pShiptoNum = '')) THEN
    -- Get Customer's default shipto.
    SELECT
      shipto_id,
      shipto_name,
      shipto_shipzone_id,
      shipto_shipvia,
      shipto_num
    INTO _shipto
    FROM shiptoinfo
    WHERE 1=1
      AND shipto_cust_id = _cust.cust_id
      AND shipto_default;
  ELSIF (pShiptoId IS NULL AND pShiptoNum IS NOT NULL) THEN
    -- Get shipto info using pShiptoNum.
    SELECT
      shipto_id,
      shipto_name,
      shipto_shipzone_id,
      shipto_shipvia,
      shipto_num
    INTO _shipto
    FROM shiptoinfo
    WHERE 1=1
      AND shipto_cust_id = _cust.cust_id
      AND shipto_num = pShiptoNum;
  ELSE
    -- Get shipto info using pShiptoId.
    SELECT
      shipto_id,
      shipto_name,
      shipto_shipzone_id,
      shipto_shipvia,
      shipto_num
    INTO _shipto
    FROM shiptoinfo
    WHERE 1=1
      AND shipto_cust_id = _cust.cust_id
      AND shipto_id = pShiptoId;
  END IF;

  IF(NOT FOUND) THEN
    RAISE EXCEPTION 'Invalid Ship-to specified when trying to get a freight quote.';
  END IF;

  -- Get curr info.
  SELECT
    curr_id,
    curr_abbr
  INTO _curr
  FROM curr_symbol
  WHERE 1=1
    AND curr_id = _cust.cust_curr_id;

  IF(NOT FOUND) THEN
    RAISE EXCEPTION 'Could not find currency when trying to get a freight quote.';
  END IF;

  -- Check pOrderDate.
  IF (pOrderDate IS NULL) THEN
    _order_date := CURRENT_DATE;
  ELSE
    _order_date := pOrderDate;
  END IF;

  -- Check pShipVia.
  IF (pShipVia IS NULL OR pShipVia = '') THEN
    IF (_shipto.shipto_shipvia IS NULL OR _shipto.shipto_shipvia = '') THEN
      _ship_via := _cust.cust_shipvia;
    ELSE
      _ship_via := _shipto.shipto_shipvia;
    END IF;
  ELSE
    _ship_via := pShipVia;
  END IF;

  -- Determine if package weight should be included in freight calculation.
  SELECT fetchMetricBool('IncludePackageWeight') INTO _includepkgweight;

  -- Check pItemQty.
  IF (pItemQty IS NULL OR array_upper(pItemQty,1) IS NULL) THEN
    -- Item Array is NULL.
    RAISE EXCEPTION 'You must specify an Item ID, Item Number or Itemsite ID to get a freight quote.';
  ELSIF (pItemArrayType = 'item_number' AND (array_upper(pItemQty,1) > 0)) THEN
    -- Using item_number.
    FOR _weights IN
      -- Get a list of aggregated weights from sites and freight classes for items.
      SELECT
        CASE WHEN _includepkgweight THEN
          SUM(qty * (item_prodweight + item_packweight))
        ELSE
          SUM(qty * (item_prodweight))
        END AS weight,
        itemsite_warehous_id,
        COALESCE(item_freightclass_id, -1) AS item_freightclass_id
      FROM
        -- Create item_number -> qty record from array.
        (SELECT
          unnest((SELECT pItemQty[1:array_upper(pItemQty,1)][1])) AS item_number,
          unnest((SELECT pItemQty[1:array_upper(pItemQty,1)][2:array_ndims(pItemQty)]))::numeric AS qty
        ) AS itemnum_qty
        JOIN item USING (item_number)
        JOIN itemsite ON item_id=itemsite_item_id
      WHERE 1=1
        AND itemsite_warehous_id = fetchprefwarehousid()
      GROUP BY
        itemsite_warehous_id,
        item_freightclass_id
    LOOP
      -- Calculate the freight detail for these item weights.
      _row := calculateFreightDetail(
        _cust.cust_id, --pCustId
        _cust.custtype_id, --pCustTypeId
        _cust.custtype_code, --pCustTypeCode
        _shipto.shipto_id, --pShiptoId
        _shipto.shipto_shipzone_id, --pShipZoneId
        _shipto.shipto_num, --pShiptoNum
        _order_date, --pOrderDate
        _ship_via, --pShipVia
        _curr.curr_id, --pCurrId
        _curr.curr_abbr, --pCurrAbbr
        _weights.itemsite_warehous_id, --pItemSiteWhsId
        _weights.item_freightclass_id, --pItemFreightclassId
        _weights.weight --pWeight
        );

      RETURN NEXT _row;
    END LOOP;

  ELSIF (pItemArrayType = 'item_id' AND (array_upper(pItemQty,1) > 0)) THEN
    -- Using item_id.
    FOR _weights IN
      -- Get a list of aggregated weights from sites and freight classes for items.
      SELECT
        CASE WHEN _includepkgweight THEN
          SUM(qty * (item_prodweight + item_packweight))
        ELSE
          SUM(qty * (item_prodweight))
        END AS weight,
        itemsite_warehous_id,
        COALESCE(item_freightclass_id, -1) AS item_freightclass_id
      FROM
        -- Create item_id -> qty record from array.
        (SELECT
          unnest((SELECT pItemQty[1:array_upper(pItemQty,1)][1]))::integer AS item_id,
          unnest((SELECT pItemQty[1:array_upper(pItemQty,1)][2:array_ndims(pItemQty)]))::numeric AS qty
        ) AS itemid_qty
        JOIN item USING (item_id)
        JOIN itemsite ON item_id=itemsite_item_id
      WHERE 1=1
        AND itemsite_warehous_id = fetchprefwarehousid()
      GROUP BY
        itemsite_warehous_id,
        item_freightclass_id
    LOOP
      -- Calculate the freight detail for these item weights.
      _row := calculateFreightDetail(
        _cust.cust_id, --pCustId
        _cust.custtype_id, --pCustTypeId
        _cust.custtype_code, --pCustTypeCode
        _shipto.shipto_id, --pShiptoId
        _shipto.shipto_shipzone_id, --pShipZoneId
        _shipto.shipto_num, --pShiptoNum
        _order_date, --pOrderDate
        _ship_via, --pShipVia
        _curr.curr_id, --pCurrId
        _curr.curr_abbr, --pCurrAbbr
        _weights.itemsite_warehous_id, --pItemSiteWhsId
        _weights.item_freightclass_id, --pItemFreightclassId
        _weights.weight --pWeight
        );

      RETURN NEXT _row;
    END LOOP;
  ELSIF (pItemArrayType = 'itemsite_id' AND (array_upper(pItemQty,1) > 0)) THEN
    -- Using itemsite_id.
    FOR _weights IN
      -- Get a list of aggregated weights from sites and freight classes for items.
      SELECT
        CASE WHEN _includepkgweight THEN
          SUM(qty * (item_prodweight + item_packweight))
        ELSE
          SUM(qty * (item_prodweight))
        END AS weight,
        itemsite_warehous_id,
        COALESCE(item_freightclass_id, -1) AS item_freightclass_id
      FROM
        -- Create itemsite_id -> qty record from array.
        (SELECT
          unnest((SELECT pItemQty[1:array_upper(pItemQty,1)][1]))::integer AS itemsite_id,
          unnest((SELECT pItemQty[1:array_upper(pItemQty,1)][2:array_ndims(pItemQty)]))::numeric AS qty
        ) AS itemsiteid_qty
        JOIN itemsite USING (itemsite_id)
        JOIN item ON item_id=itemsite_item_id
      WHERE 1=1
      GROUP BY
        itemsite_warehous_id,
        item_freightclass_id
    LOOP
      -- Calculate the freight detail for these item weights.
      _row := calculateFreightDetail(
        _cust.cust_id, --pCustId
        _cust.custtype_id, --pCustTypeId
        _cust.custtype_code, --pCustTypeCode
        _shipto.shipto_id, --pShiptoId
        _shipto.shipto_shipzone_id, --pShipZoneId
        _shipto.shipto_num, --pShiptoNum
        _order_date, --pOrderDate
        _ship_via, --pShipVia
        _curr.curr_id, --pCurrId
        _curr.curr_abbr, --pCurrAbbr
        _weights.itemsite_warehous_id, --pItemSiteWhsId
        _weights.item_freightclass_id, --pItemFreightclassId
        _weights.weight --pWeight
        );

      RETURN NEXT _row;
    END LOOP;
  ELSE -- The item array provided is invalid.
    RAISE EXCEPTION 'The Item/Itemsite array provided when trying to get a freight quote is invalid.';
  END IF;

  IF(NOT FOUND) THEN
    RAISE EXCEPTION 'Error trying to aggregated weights when getting a freight quote.';
  END IF;

  -- Print debug.
  IF (_debug) THEN
    RAISE NOTICE 'pCustId = %', _cust.cust_id;
    RAISE NOTICE 'pCustTypeId = %', _cust.custtype_id;
    RAISE NOTICE 'pCustTypeCode = %', _cust.custtype_code;
    RAISE NOTICE 'pShiptoId = %', _shipto.shipto_id;
    RAISE NOTICE 'pShipZoneId = %', _shipto.shipto_shipzone_id;
    RAISE NOTICE 'pShiptoNum = %', _shipto.shipto_num;
    RAISE NOTICE 'pOrderDate = %', _order_date;
    RAISE NOTICE 'pShipVia = %', _ship_via;
    RAISE NOTICE 'pCurrId = %', _curr.curr_id;
    RAISE NOTICE 'pCurrAbbr = %', _curr.curr_abbr;
  END IF;

  RETURN;
END;
$$ LANGUAGE 'plpgsql';

