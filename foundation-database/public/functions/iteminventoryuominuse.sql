CREATE OR REPLACE FUNCTION itemInventoryUOMInUse(pItemid INTEGER) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _uomid INTEGER;
  _result INTEGER;
BEGIN
  SELECT item_inv_uom_id INTO _uomid
    FROM item
   WHERE(item_id=pItemid);

  SELECT itemuomconv_id INTO _result
    FROM itemuomconv
   WHERE(itemuomconv_item_id=pItemid)
   LIMIT 1;
  IF (FOUND) THEN
    RETURN TRUE;
  END IF;

  SELECT itemsite_id INTO _result
  FROM itemsite WHERE ( (itemsite_item_id=pItemid)
                  AND   (itemsite_qtyonhand <> 0) )
  LIMIT 1;
  IF (FOUND) THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
