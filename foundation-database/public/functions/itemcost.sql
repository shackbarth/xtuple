CREATE OR REPLACE FUNCTION itemCost(INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemsiteid ALIAS FOR $1;
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

