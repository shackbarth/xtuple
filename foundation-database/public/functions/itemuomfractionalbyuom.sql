CREATE OR REPLACE FUNCTION itemUOMFractionalByUOM(INTEGER, INTEGER) RETURNS BOOL AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  pUomid ALIAS FOR $2;
  _frac BOOLEAN;
BEGIN
  SELECT itemuomconv_fractional
    INTO _frac
    FROM item
    JOIN itemuomconv ON (itemuomconv_item_id=item_id)
   WHERE((item_id=pItemid)
     AND ((itemuomconv_from_uom_id=item_inv_uom_id AND itemuomconv_to_uom_id=pUomid)
       OR (itemuomconv_to_uom_id=item_inv_uom_id AND itemuomconv_from_uom_id=pUomid)))
   LIMIT 1;

  IF (NOT FOUND) THEN
    SELECT item_fractional
      INTO _frac
      FROM item
      JOIN uom ON (item_inv_uom_id=uom_id)
     WHERE(item_id=pItemid);
  END IF;

  RETURN _frac;
END;
' LANGUAGE 'plpgsql';
