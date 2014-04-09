CREATE OR REPLACE FUNCTION itemuomtouom(INTEGER, INTEGER, INTEGER, NUMERIC) RETURNS NUMERIC STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
BEGIN
  RETURN itemuomtouom($1, $2, $3, $4, 'qty');
END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION itemuomtouom(pItemid INTEGER,
                                        pUomidFrom INTEGER,
                                        pUomidTo INTEGER,
                                        pQtyFrom NUMERIC,
                                        pLocale TEXT) RETURNS NUMERIC STABLE AS $$
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
  _frac      BOOLEAN := FALSE;
BEGIN

  SELECT item_inv_uom_id, item_fractional
    INTO _item
    FROM item
   WHERE(item_id=pItemid);
  IF(NOT FOUND) THEN
    RAISE EXCEPTION 'No item record was found for item id %', pItemid;
  END IF;

  _uomidFrom := COALESCE(pUomidFrom, _item.item_inv_uom_id);
  _uomidTo   := COALESCE(pUomidTo,   _item.item_inv_uom_id);
  _uomidInv  := _item.item_inv_uom_id;

  -- Should we round the qty here or not?
  IF(_uomidFrom = _uomidTo) THEN
    -- Both from/to are the same. If it is the item inv uom
    -- then use the item fractional value otherwise assume
    -- it is fractional for now so the user gets the same value back.
    IF(_uomidFrom = _item.item_inv_uom_id) THEN
      _frac := _item.item_fractional;
    ELSE
      _frac := true;
    END IF;
    RETURN roundLocale(_frac, pQtyFrom, pLocale);
  END IF;

  -- Try a direct conversion
  SELECT itemuomconv_from_uom_id, itemuomconv_from_value,
         itemuomconv_to_uom_id, itemuomconv_to_value,
         itemuomconv_fractional
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

    -- If we are converting to the item inv uom use the item fractional value
    -- otherwise use the conversion fractional value.
    if(_uomidTo = _uomidInv) THEN
      _frac := _item.item_fractional;
    ELSE
      _frac := _conv.itemuomconv_fractional;
    END IF;
    _value := roundLocale(_frac, ((_valueTo/_valueFrom) * pQtyFrom), pLocale);
  ELSE
    -- Try to convert the from uom to the inventory uom
    SELECT itemuomconv_from_uom_id, itemuomconv_from_value,
           itemuomconv_to_uom_id, itemuomconv_to_value,
           itemuomconv_fractional
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
    IF (_conv.itemuomconv_fractional OR _item.item_fractional) THEN
      _frac := TRUE;
    END IF;
    -- Try to convert the to uom to the inventory uom
    SELECT itemuomconv_from_uom_id, itemuomconv_from_value,
           itemuomconv_to_uom_id, itemuomconv_to_value,
           itemuomconv_fractional
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
    IF (_conv.itemuomconv_fractional OR _item.item_fractional) THEN
      _frac := TRUE;
    END IF;
    _value := roundLocale(_frac, (_value * pQtyFrom), pLocale);
  END IF;

  RETURN _value;
END;
$$ LANGUAGE 'plpgsql';

