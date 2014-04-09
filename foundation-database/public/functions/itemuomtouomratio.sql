CREATE OR REPLACE FUNCTION itemuomtouomratio(pItemid INTEGER,
                                             pUomidFrom INTEGER,
                                             pUomidTo INTEGER) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _uomidFrom INTEGER;
  _uomidTo   INTEGER;
  _uomidInv  INTEGER;
  _valueFrom NUMERIC := 0.0;
  _valueTo   NUMERIC := 0.0;
  _value     NUMERIC := 0.0;
  _item      RECORD;
  _conv      RECORD;
BEGIN

  SELECT item_inv_uom_id
    INTO _item
    FROM item
   WHERE(item_id=pItemid);
  IF(NOT FOUND) THEN
    RAISE EXCEPTION 'No item record was found for item id %', pItemid;
  END IF;

  _uomidFrom := COALESCE(pUomidFrom, _item.item_inv_uom_id);
  _uomidTo   := COALESCE(pUomidTo,   _item.item_inv_uom_id);
  _uomidInv  := _item.item_inv_uom_id;

  IF(_uomidFrom = _uomidTo) THEN
    RETURN 1.0;
  END IF;

  -- Try a direct conversion
  SELECT itemuomconv_from_uom_id, itemuomconv_from_value,
         itemuomconv_to_uom_id, itemuomconv_to_value
    INTO _conv
    FROM itemuomconv
   WHERE(((itemuomconv_from_uom_id=_uomidFrom AND itemuomconv_to_uom_id=_uomidTo)
       OR (itemuomconv_from_uom_id=_uomidTo AND itemuomconv_to_uom_id=_uomidFrom))
     AND (itemuomconv_item_id=pItemid));
  IF(FOUND) THEN
    IF(_conv.itemuomconv_from_uom_id=_uomidFrom) THEN
      _valueFrom := _conv.itemuomconv_from_value;
      _valueTo := _conv.itemuomconv_to_value;
    ELSE
      _valueFrom := _conv.itemuomconv_to_value;
      _valueTo := _conv.itemuomconv_from_value;
    END IF;
    _value := (_valueTo / _valueFrom);
  ELSE
    -- Try to convert the from uom to the inventory uom
    SELECT itemuomconv_from_uom_id, itemuomconv_from_value,
           itemuomconv_to_uom_id, itemuomconv_to_value
      INTO _conv
      FROM itemuomconv
     WHERE(((itemuomconv_from_uom_id=_uomidFrom AND itemuomconv_to_uom_id=_uomidInv)
         OR (itemuomconv_from_uom_id=_uomidInv AND itemuomconv_to_uom_id=_uomidFrom))
       AND (itemuomconv_item_id=pItemid));
    IF(NOT FOUND) THEN
      RAISE EXCEPTION 'A conversion for item_id % from uom_id % to inv_uom_id % was not found.', pItemid, _uomidFrom, _uomidInv;
    END IF;
    IF(_conv.itemuomconv_from_uom_id=_uomidInv) THEN
      _valueFrom := _conv.itemuomconv_from_value;
      _valueTo := _conv.itemuomconv_to_value;
    ELSE
      _valueFrom := _conv.itemuomconv_to_value;
      _valueTo := _conv.itemuomconv_from_value;
    END IF;
    _value := (_valueTo / _valueFrom);
    -- Try to convert the to uom to the inventory uom
    SELECT itemuomconv_from_uom_id, itemuomconv_from_value,
           itemuomconv_to_uom_id, itemuomconv_to_value
      INTO _conv
      FROM itemuomconv
     WHERE(((itemuomconv_from_uom_id=_uomidInv AND itemuomconv_to_uom_id=_uomidTo)
         OR (itemuomconv_from_uom_id=_uomidTo AND itemuomconv_to_uom_id=_uomidInv))
       AND (itemuomconv_item_id=pItemid));
    IF(NOT FOUND) THEN
      RAISE EXCEPTION 'A conversion for item_id % from uom_id % to inv_uom_id % was not found.', pItemid, _uomidTo, _uomidInv;
    END IF;
    IF(_conv.itemuomconv_from_uom_id=_uomidInv) THEN
      _valueFrom := _conv.itemuomconv_from_value;
      _valueTo := _conv.itemuomconv_to_value;
    ELSE
      _valueFrom := _conv.itemuomconv_to_value;
      _valueTo := _conv.itemuomconv_from_value;
    END IF;
    _value := _value * (_valueTo / _valueFrom);
  END IF;

  RETURN _value;
END;
$$ LANGUAGE 'plpgsql';

