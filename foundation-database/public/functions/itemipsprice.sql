
CREATE OR REPLACE FUNCTION itemIpsPrice(pItemid INTEGER,
                                        pCustid INTEGER,
                                        pShiptoid INTEGER,
                                        pQty NUMERIC,
                                        pQtyUOM INTEGER,
                                        pPriceUOM INTEGER,
                                        pCurrid INTEGER,
                                        pEffective DATE,
                                        pAsOf DATE,
                                        pSiteid INTEGER) RETURNS SETOF itemprice AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _row  itemprice%ROWTYPE;
  _sale RECORD;
  _ips RECORD;
  _item RECORD;
  _cust RECORD;
  _shipto RECORD;
  _itempricepricerat NUMERIC := 1.0;
  _listprice NUMERIC := 0.0;
  _qty NUMERIC;
  _asof DATE;
  _wholesalepricecosting BOOLEAN := false;
  _long30markups BOOLEAN := false;
  _itempricingprecedence BOOLEAN := false;

BEGIN
  _wholesalepricecosting := fetchMetricBool('WholesalePriceCosting');
  _long30markups := fetchMetricBool('Long30Markups');
  _itempricingprecedence := fetchMetricBool('ItemPricingPrecedence');

-- Return the itemPrice in the currency passed in as pCurrid
  _qty := itemuomtouom(pItemid, pQtyUOM, NULL, pQty);

-- If no as of passed, use current date
  _asof := COALESCE(pAsOf, CURRENT_DATE);

--  Cache Item, Customer and Shipto
  SELECT item.*, (itemCost(itemsite_id) / itemuomtouomratio(item_id, item_inv_uom_id, item_price_uom_id)) AS invcost INTO _item
  FROM item LEFT OUTER JOIN itemsite ON (itemsite_item_id=item_id AND itemsite_warehous_id=pSiteid)
  WHERE (item_id=pItemid);

  SELECT * INTO _cust
  FROM custinfo JOIN custtype ON (custtype_id=cust_custtype_id)
  WHERE (cust_id=pCustid);

  SELECT * INTO _shipto
  FROM shiptoinfo
  WHERE (shipto_id=pShiptoid);

-- Get a value here so we do not have to call the function several times
  SELECT itemuomtouomratio(pItemid, pPriceUOM, _item.item_price_uom_id) AS ratio
    INTO _itempricepricerat;

-- First get a sales price if any so we when we find other prices
-- we can determine if we want that price or this price.
--  Check for a Sale Price
  SELECT INTO _sale
    currToCurr(ipshead_curr_id, pCurrid, ipsprice_price, pEffective) AS rightprice, ipsitem_type AS righttype
  FROM (
  SELECT ipsitem_ipshead_id AS ipsprice_ipshead_id, ipsitem_type,
         CASE WHEN (ipsitem_type = 'N') THEN
               (ipsitem_price * itemuomtouomratio(_item.item_id, pPriceUOM, ipsitem_price_uom_id))
              WHEN (ipsitem_type = 'D') THEN
               noNeg(_item.item_listprice - (_item.item_listprice * ipsitem_discntprcnt) - ipsitem_fixedamtdiscount) * _itempricepricerat
              WHEN ((ipsitem_type = 'M') AND _long30markups AND _wholesalepricecosting) THEN
               (_item.item_listcost / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
              WHEN ((ipsitem_type = 'M') AND _long30markups) THEN
               (_item.invcost / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
              WHEN (ipsitem_type = 'M' AND _wholesalepricecosting) THEN
               (_item.item_listcost + (_item.item_listcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
              WHEN (ipsitem_type = 'M') THEN
               (_item.invcost + (_item.invcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
              ELSE 0.00
         END AS ipsprice_price,
         CASE WHEN (ipsitem_item_id=_item.item_id) THEN itemuomtouom(ipsitem_item_id, ipsitem_qty_uom_id, NULL, ipsitem_qtybreak)
              ELSE ipsitem_qtybreak
         END AS ipsprice_qtybreak,
         (COALESCE(ipsitem_price_uom_id, -1)=COALESCE(pPriceUOM,-1)) AS uommatched,
         CASE WHEN (_itempricingprecedence) THEN (COALESCE(ipsitem_item_id, -1)=_item.item_id)
              ELSE true END AS itemmatched
    FROM ipsiteminfo
   WHERE(ipsitem_item_id=_item.item_id) OR (ipsitem_prodcat_id=_item.item_prodcat_id) ) AS
        ipsprice, ipshead, ipsass, sale
  WHERE ( (ipsprice_ipshead_id=ipshead_id)
    AND   (sale_ipshead_id=ipsprice_ipshead_id)
    AND   (_asof BETWEEN sale_startdate AND sale_enddate)
    AND   (ipsprice_qtybreak <= _qty)
    AND   (ipsass_ipshead_id=ipshead_id)
    AND ( (ipsass_shipto_id=_shipto.shipto_id)
     OR   ((COALESCE(LENGTH(ipsass_shipto_pattern), 0) > 0) AND (_shipto.shipto_num ~ ipsass_shipto_pattern))
     OR   (ipsass_cust_id=_cust.cust_id)
     OR   (ipsass_custtype_id=_cust.cust_custtype_id)
     OR   ((COALESCE(LENGTH(ipsass_custtype_pattern), 0) > 0) AND (_cust.custtype_code ~ ipsass_custtype_pattern)) )
        )
  ORDER BY itemmatched DESC, uommatched DESC, ipsprice_qtybreak DESC, ipsprice_price ASC
  LIMIT 1;

-- Find the best Price Schedule Price
 
  SELECT INTO _ips
    currToCurr(ipshead_curr_id, pCurrid, protoprice, pEffective) AS rightprice, ipsitem_type AS righttype
  
  FROM (
    SELECT *,
           CASE WHEN (COALESCE(ipsass_shipto_id, -1) > 0) THEN 1
             WHEN (COALESCE(LENGTH(ipsass_shipto_pattern), 0) > 0) THEN 2
             WHEN (COALESCE(ipsass_cust_id, -1) > 0) THEN 3
             WHEN (COALESCE(ipsass_custtype_id, -1) > 0) THEN 4
             WHEN (COALESCE(LENGTH(ipsass_custtype_pattern), 0) > 0) THEN 5
             ELSE 99
           END AS assignseq,
           CASE WHEN (ipsitem_type = 'N') THEN
                 (ipsitem_price * itemuomtouomratio(_item.item_id, pPriceUOM, ipsitem_price_uom_id))
                WHEN (ipsitem_type = 'D') THEN
                 noNeg(_item.item_listprice - (_item.item_listprice * ipsitem_discntprcnt) - ipsitem_fixedamtdiscount) * _itempricepricerat
                WHEN ((ipsitem_type = 'M') AND _long30markups AND _wholesalepricecosting) THEN
                 (_item.item_listcost / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
                WHEN ((ipsitem_type = 'M') AND _long30markups) THEN
                 (_item.invcost / (1.0 - ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
                WHEN (ipsitem_type = 'M' AND _wholesalepricecosting) THEN
                 (_item.item_listcost + (_item.item_listcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
                WHEN (ipsitem_type = 'M') THEN
                 (_item.invcost + (_item.invcost * ipsitem_discntprcnt) + ipsitem_fixedamtdiscount) * _itempricepricerat
                ELSE 0.00
           END AS protoprice,
           CASE WHEN (ipsitem_item_id=_item.item_id) THEN itemuomtouom(ipsitem_item_id, ipsitem_qty_uom_id, NULL, ipsitem_qtybreak)
                ELSE ipsitem_qtybreak
           END AS protoqtybreak,
           (COALESCE(ipsitem_price_uom_id, -1)=COALESCE(pPriceUOM,-1)) AS uommatched,
           CASE WHEN (_itempricingprecedence) THEN (COALESCE(ipsitem_item_id, -1)=_item.item_id)
                ELSE true END AS itemmatched
    FROM ipsass JOIN ipshead ON (ipshead_id=ipsass_ipshead_id)
                JOIN ipsiteminfo ON (ipsitem_ipshead_id=ipshead_id)
    WHERE ((ipsitem_item_id=_item.item_id) OR (ipsitem_prodcat_id=_item.item_prodcat_id))
      AND (_asof BETWEEN ipshead_effective AND ipshead_expires)
      AND ((ipsitem_warehous_id=pSiteid) OR (ipsitem_warehous_id IS NULL))
      AND ( (ipsass_shipto_id=_shipto.shipto_id)
       OR   ((COALESCE(LENGTH(ipsass_shipto_pattern), 0) > 0) AND (_shipto.shipto_num ~ ipsass_shipto_pattern))
       OR   (ipsass_cust_id=_cust.cust_id)
       OR   (ipsass_custtype_id=_cust.cust_custtype_id)
       OR   ((COALESCE(LENGTH(ipsass_custtype_pattern), 0) > 0) AND (_cust.custtype_code ~ ipsass_custtype_pattern))
          )
  ) AS proto
  WHERE (protoqtybreak <= pQty)
  ORDER BY assignseq, itemmatched DESC, protoqtybreak DESC, rightprice
  LIMIT 1;
 
  IF (_ips.rightprice IS NOT NULL) THEN
    IF ((_sale.rightprice IS NOT NULL) AND (_sale.rightprice < _ips.rightprice)) THEN
      RAISE DEBUG 'itemprice, item=%, cust=%, shipto=%, sale price= %', pItemid, pCustid, pShiptoid, _sale.rightprice;
      _row.itemprice_price := _sale.rightprice;
      _row.itemprice_type := _sale.righttype;
      RETURN NEXT _row;
    END IF;
    RAISE DEBUG 'itemprice, item=%, cust=%, shipto=%, schedule price= %', pItemid, pCustid, pShiptoid, _ips.rightprice;
    _row.itemprice_price := _ips.rightprice;
    _row.itemprice_type := _ips.righttype;
    RETURN NEXT _row;
  END IF;

--  If item is exclusive then list list price does not apply
  IF (_item.item_exclusive) THEN
    RAISE DEBUG 'itemprice, item=%, cust=%, shipto=%, item exclusive, price=-9999', pItemid, pCustid, pShiptoid;
    _row.itemprice_price := -9999.0;
    _row.itemprice_type := '';
    RETURN NEXT _row;
  END IF;

--  Check for a list price
  _listprice := noNeg(currToLocal(pCurrid, _item.item_listprice - (_item.item_listprice * COALESCE(_cust.cust_discntprcnt, 0.0)), pEffective)
                      * itemuomtouomratio(pItemid, pPriceUOM, _item.item_price_uom_id));

  RAISE DEBUG 'itemprice, item=%, cust=%, shipto=%, list price= %', pItemid, pCustid, pShiptoid, _listprice;

  _row.itemprice_price := _listprice;
  _row.itemprice_type := 'P';
  RETURN NEXT _row;

  RETURN;

END;
$$ LANGUAGE 'plpgsql';
