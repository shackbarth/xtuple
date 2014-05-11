CREATE OR REPLACE FUNCTION itemCost(pItemid INTEGER,
                                    pCustid INTEGER,
                                    pShiptoid INTEGER,
                                    pQty NUMERIC,
                                    pQtyUOM INTEGER,
                                    pPriceUOM INTEGER,
                                    pCurrid INTEGER,
                                    pEffective DATE,
                                    pAsOf DATE,
                                    pSiteid INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
--
-- Overload for future costing enhancements
--
DECLARE
  _cost NUMERIC := 0.0;
BEGIN
  SELECT itemcost(itemsite_id) INTO _cost
  FROM itemsite
  WHERE (itemsite_item_id=pItemid)
    AND (itemsite_warehous_id=pSiteid);

  RETURN _cost;
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION itemCost(pItemsiteid INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _cost NUMERIC;
BEGIN
  SELECT CASE WHEN (itemsite_costmethod='A' AND itemsite_qtyonhand != 0.0) THEN (itemsite_value / itemsite_qtyonhand)
              WHEN (itemsite_costmethod='A' AND itemsite_qtyonhand = 0.0) THEN 0.0
              WHEN (itemsite_costmethod='N') THEN 0.0
              ELSE stdCost(itemsite_item_id)
         END INTO _cost
    FROM itemsite
   WHERE(itemsite_id=pItemsiteid);
  RETURN _cost;
END;
$$ LANGUAGE 'plpgsql';
