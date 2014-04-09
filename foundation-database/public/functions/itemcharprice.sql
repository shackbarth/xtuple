CREATE OR REPLACE FUNCTION itemCharPrice(INTEGER, INTEGER, TEXT, INTEGER, NUMERIC) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pCharid ALIAS FOR $2;
  pCharValue ALIAS FOR $3;
  pCustid ALIAS FOR $4;
  pQty ALIAS FOR $5;

BEGIN
  RETURN itemCharPrice(pItemid, pCharid, pCharValue, pCustid, -1, pQty, baseCurrId(), CURRENT_DATE);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION itemCharPrice(INTEGER, INTEGER, TEXT, INTEGER, INTEGER, NUMERIC) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pCharid ALIAS FOR $2;
  pCharValue ALIAS FOR $3;
  pCustid ALIAS FOR $4;
  pShiptoid ALIAS FOR $5;
  pQty ALIAS FOR $6;

BEGIN
  RETURN itemCharPrice(pItemid, pCharid, pCharValue, pCustid, pShiptoid, pQty, baseCurrId(), CURRENT_DATE);
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION itemCharPrice(INTEGER, INTEGER, TEXT, INTEGER, INTEGER, NUMERIC, INTEGER) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pCharid ALIAS FOR $2;
  pCharValue ALIAS FOR $3;
  pCustid ALIAS FOR $4;
  pShiptoid ALIAS FOR $5;
  pQty ALIAS FOR $6;
  pCurrid ALIAS FOR $7;

BEGIN
  RETURN itemCharPrice(pItemid, pCharid, pCharValue, pCustid, pShiptoid, pQty, pCurrid, CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION itemCharPrice(INTEGER, INTEGER, TEXT, INTEGER, INTEGER, NUMERIC, INTEGER, DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pCharid ALIAS FOR $2;
  pCharValue ALIAS FOR $3;
  pCustid ALIAS FOR $4;
  pShiptoid ALIAS FOR $5;
  pQty ALIAS FOR $6;
  pCurrid ALIAS FOR $7;
  pEffective ALIAS FOR $8;

BEGIN
  RETURN itemCharPrice(pItemid, pCharid, pCharValue, pCustid, pShiptoid, pQty, pCurrid, CURRENT_DATE, CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION itemCharPrice(INTEGER, INTEGER, TEXT, INTEGER, INTEGER, NUMERIC, INTEGER, DATE, DATE) RETURNS NUMERIC AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pCharid ALIAS FOR $2;
  pCharValue ALIAS FOR $3;
  pCustid ALIAS FOR $4;
  pShiptoid ALIAS FOR $5;
  pQty ALIAS FOR $6;
  pCurrid ALIAS FOR $7;
  pEffective ALIAS FOR $8;
  pAsOf ALIAS FOR $9;
  _price NUMERIC;
  _sales NUMERIC;
  _item RECORD;
  _iteminvpricerat NUMERIC;

BEGIN
-- If the charass_value passed in is NULL, we can skip this function
  IF (pCharValue IS NULL) THEN 
    RETURN 0;
  END IF;

-- Return the itemCharPrice in the currency passed in as pCurrid

-- Get a value here so we do not have to call the function several times
  SELECT iteminvpricerat(pItemid)
    INTO _iteminvpricerat;

-- First get a sales price if any so we when we find other prices
-- we can determine if we want that price or this price.
--  Check for a Sale Price
  SELECT currToCurr(ipshead_curr_id, pCurrid,
                      ipsprice_price - (ipsprice_price * cust_discntprcnt),
                      pEffective) INTO _sales
  FROM (
  SELECT ipsitem_ipshead_id AS ipsprice_ipshead_id,
         itemuomtouom(ipsitem_item_id, ipsitem_qty_uom_id, NULL, ipsitem_qtybreak) AS ipsprice_qtybreak,
         (ipsitemchar_price * itemuomtouomratio(ipsitem_item_id, NULL, ipsitem_price_uom_id)) * _iteminvpricerat AS ipsprice_price
    FROM ipsiteminfo,ipsitemchar
   WHERE((ipsitem_item_id=pItemid)
    AND (ipsitemchar_char_id=pCharid)
    AND (ipsitemchar_value=pCharValue)
    AND (ipsitemchar_ipsitem_id=ipsitem_id))
       ) AS
        ipsprice, ipshead, sale, custinfo
  WHERE ( (ipsprice_ipshead_id=ipshead_id)
   AND (sale_ipshead_id=ipshead_id)
   AND (pAsOf BETWEEN sale_startdate AND sale_enddate)
   AND (ipsprice_qtybreak <= pQty)
   AND (cust_id=pCustid) )
  ORDER BY ipsprice_qtybreak DESC, ipsprice_price ASC
  LIMIT 1;

--  Check for a Customer Shipto Price
  SELECT currToCurr(ipshead_curr_id, pCurrid, ipsprice_price, pEffective) INTO _price
  FROM (
  SELECT ipsitem_ipshead_id AS ipsprice_ipshead_id,
         itemuomtouom(ipsitem_item_id, ipsitem_qty_uom_id, NULL, ipsitem_qtybreak) AS ipsprice_qtybreak,
         (ipsitemchar_price * itemuomtouomratio(ipsitem_item_id, NULL, ipsitem_price_uom_id)) * _iteminvpricerat AS ipsprice_price
    FROM ipsiteminfo,ipsitemchar
   WHERE ((ipsitem_item_id=pItemid)
    AND (ipsitemchar_char_id=pCharid)
    AND (ipsitemchar_value=pCharValue)
    AND (ipsitemchar_ipsitem_id=ipsitem_id))
       ) AS
        ipsprice, ipshead, ipsass
  WHERE ( (ipsprice_ipshead_id=ipshead_id)
   AND (ipsass_ipshead_id=ipshead_id)
   AND (pAsOf BETWEEN ipshead_effective AND (ipshead_expires - 1))
   AND (ipsprice_qtybreak <= pQty)
   AND (ipsass_shipto_id != -1)
   AND (ipsass_shipto_id=pShiptoid) )
  ORDER BY ipsprice_qtybreak DESC, ipsprice_price ASC
  LIMIT 1;

  IF (_price IS NOT NULL) THEN
    IF ((_sales IS NOT NULL) AND (_sales < _price)) THEN
      RETURN _sales;
    END IF;
    RETURN _price;
  END IF;

--  Check for a Customer Shipto Pattern Price
  SELECT currToCurr(ipshead_curr_id, pCurrid, ipsprice_price, pEffective) INTO _price
  FROM (
  SELECT ipsitem_ipshead_id AS ipsprice_ipshead_id,
         itemuomtouom(ipsitem_item_id, ipsitem_qty_uom_id, NULL, ipsitem_qtybreak) AS ipsprice_qtybreak,
         (ipsitemchar_price * itemuomtouomratio(ipsitem_item_id, NULL, ipsitem_price_uom_id)) * _iteminvpricerat AS ipsprice_price
    FROM ipsiteminfo,ipsitemchar
   WHERE ((ipsitem_item_id=pItemid)
    AND (ipsitemchar_char_id=pCharid)
    AND (ipsitemchar_value=pCharValue)
    AND (ipsitemchar_ipsitem_id=ipsitem_id))
       ) AS
        ipsprice, ipshead, ipsass, shiptoinfo
  WHERE ( (ipsprice_ipshead_id=ipshead_id)
   AND (ipsass_ipshead_id=ipshead_id)
   AND (pAsOf BETWEEN ipshead_effective AND (ipshead_expires - 1))
   AND (ipsprice_qtybreak <= pQty)
   AND (COALESCE(length(ipsass_shipto_pattern), 0) > 0)
   AND (shipto_num ~ ipsass_shipto_pattern)
   AND (ipsass_cust_id=pCustid)
   AND (shipto_id=pShiptoid) )
  ORDER BY ipsprice_qtybreak DESC, ipsprice_price ASC
  LIMIT 1;

  IF (_price IS NOT NULL) THEN
    IF ((_sales IS NOT NULL) AND (_sales < _price)) THEN
      RETURN _sales;
    END IF;
    RETURN _price;
  END IF;

--  Check for a Customer Price
  SELECT currToCurr(ipshead_curr_id, pCurrid, ipsprice_price, pEffective) INTO _price
  FROM (
  SELECT ipsitem_ipshead_id AS ipsprice_ipshead_id,
         itemuomtouom(ipsitem_item_id, ipsitem_qty_uom_id, NULL, ipsitem_qtybreak) AS ipsprice_qtybreak,
         (ipsitemchar_price * itemuomtouomratio(ipsitem_item_id, NULL, ipsitem_price_uom_id)) * _iteminvpricerat AS ipsprice_price
    FROM ipsiteminfo,ipsitemchar
   WHERE ((ipsitem_item_id=pItemid)
    AND (ipsitemchar_char_id=pCharid)
    AND (ipsitemchar_value=pCharValue)
    AND (ipsitemchar_ipsitem_id=ipsitem_id))
       ) AS
        ipsprice, ipshead, ipsass
  WHERE ( (ipsprice_ipshead_id=ipshead_id)
   AND (ipsass_ipshead_id=ipshead_id)
   AND (pAsOf BETWEEN ipshead_effective AND (ipshead_expires - 1))
   AND (ipsprice_qtybreak <= pQty)
   AND (COALESCE(length(ipsass_shipto_pattern), 0) = 0)
   AND (ipsass_cust_id=pCustid) )
  ORDER BY ipsprice_qtybreak DESC, ipsprice_price ASC
  LIMIT 1;

  IF (_price IS NOT NULL) THEN
    IF ((_sales IS NOT NULL) AND (_sales < _price)) THEN
      RETURN _sales;
    END IF;
    RETURN _price;
  END IF;

--  Check for a Customer Type Price
  SELECT currToCurr(ipshead_curr_id, pCurrid, ipsprice_price, pEffective) INTO _price
  FROM (
  SELECT ipsitem_ipshead_id AS ipsprice_ipshead_id,
         itemuomtouom(ipsitem_item_id, ipsitem_qty_uom_id, NULL, ipsitem_qtybreak) AS ipsprice_qtybreak,
         (ipsitemchar_price * itemuomtouomratio(ipsitem_item_id, NULL, ipsitem_price_uom_id)) * _iteminvpricerat AS ipsprice_price
    FROM ipsiteminfo,ipsitemchar
   WHERE((ipsitem_item_id=pItemid)
    AND (ipsitemchar_char_id=pCharid)
    AND (ipsitemchar_value=pCharValue)
    AND (ipsitemchar_ipsitem_id=ipsitem_id))
       ) AS
        ipsprice, ipshead, ipsass, custinfo
  WHERE ( (ipsprice_ipshead_id=ipshead_id)
   AND (ipsass_ipshead_id=ipshead_id)
   AND (ipsass_custtype_id=cust_custtype_id)
   AND (pAsOf BETWEEN ipshead_effective AND (ipshead_expires - 1))
   AND (ipsprice_qtybreak <= pQty)
   AND (cust_id=pCustid) )
  ORDER BY ipsprice_qtybreak DESC, ipsprice_price ASC
  LIMIT 1;

  IF (_price IS NOT NULL) THEN
    IF ((_sales IS NOT NULL) AND (_sales < _price)) THEN
      RETURN _sales;
    END IF;
    RETURN _price;
  END IF;

--  Check for a Customer Type Pattern Price
  SELECT currToCurr(ipshead_curr_id, pCurrid, ipsprice_price, pEffective) INTO _price
  FROM (
  SELECT ipsitem_ipshead_id AS ipsprice_ipshead_id,
         itemuomtouom(ipsitem_item_id, ipsitem_qty_uom_id, NULL, ipsitem_qtybreak) AS ipsprice_qtybreak,
         (ipsitemchar_price * itemuomtouomratio(ipsitem_item_id, NULL, ipsitem_price_uom_id)) * _iteminvpricerat AS ipsprice_price
    FROM ipsiteminfo,ipsitemchar
   WHERE ((ipsitem_item_id=pItemid)
    AND (ipsitemchar_char_id=pCharid)
    AND (ipsitemchar_value=pCharValue)
    AND (ipsitemchar_ipsitem_id=ipsitem_id))
       ) AS
        ipsprice, ipshead, ipsass, custtype, custinfo
  WHERE ( (ipsprice_ipshead_id=ipshead_id)
   AND (ipsass_ipshead_id=ipshead_id)
   AND (coalesce(length(ipsass_custtype_pattern), 0) > 0)
   AND (custtype_code ~ ipsass_custtype_pattern)
   AND (cust_custtype_id=custtype_id)
   AND (pAsOf BETWEEN ipshead_effective AND (ipshead_expires - 1))
   AND (ipsprice_qtybreak <= pQty)
   AND (cust_id=pCustid) )
  ORDER BY ipsprice_qtybreak DESC, ipsprice_price ASC
  LIMIT 1;

  IF (_price IS NOT NULL) THEN
    IF ((_sales IS NOT NULL) AND (_sales < _price)) THEN
      RETURN _sales;
    END IF;
    RETURN _price;
  END IF;

-- If we have not found another price yet and we have a
-- sales price we will use that.
  IF (_sales IS NOT NULL) THEN
    RETURN _sales;
  END IF;

--  Check for a list price
  SELECT MIN(currToLocal(pCurrid,
                       charass_price - (charass_price * COALESCE(cust_discntprcnt, 0)),
                       pEffective)) AS price,
         item_exclusive INTO _item
  FROM charass,item LEFT OUTER JOIN custinfo ON (cust_id=pCustid)
  WHERE ((item_id=pItemid)
   AND (charass_char_id=pCharid)
   AND (charass_value=pCharValue)
   AND (charass_target_type='I')
   AND (charass_target_id=item_id))
  GROUP BY item_exclusive;
  IF (FOUND) THEN
    IF (NOT _item.item_exclusive) THEN
      IF (_item.price < 0) THEN
        RETURN 0;
      ELSE
        RETURN _item.price;
      END IF;
    ELSE
      RETURN 0;
    END IF;
  ELSE
    RETURN 0;
  END IF;

END;
$$ LANGUAGE 'plpgsql';
