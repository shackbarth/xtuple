CREATE OR REPLACE FUNCTION itemUOMRatioByType(INTEGER, TEXT) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pUomtype ALIAS FOR $2;
  _ratio NUMERIC;
BEGIN
  -- Return the ration as alternate / inventory uom
  SELECT CASE WHEN(itemuomconv_from_uom_id=item_inv_uom_id) THEN itemuomconv_to_value / itemuomconv_from_value
              ELSE itemuomconv_from_value / itemuomconv_to_value
         END
    INTO _ratio
    FROM item
    JOIN itemuomconv ON (itemuomconv_item_id=item_id)
    JOIN itemuom ON (itemuom_itemuomconv_id=itemuomconv_id)
    JOIN uomtype ON (itemuom_uomtype_id=uomtype_id)
   WHERE((item_id=pItemid)
     AND (uomtype_name=pUomtype))
   LIMIT 1;

  IF (NOT FOUND) THEN
    _ratio := 1.0;
  END IF;

  RETURN _ratio;
END;
$$ LANGUAGE 'plpgsql';
