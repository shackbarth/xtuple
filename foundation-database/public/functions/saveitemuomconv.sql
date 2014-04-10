CREATE OR REPLACE FUNCTION saveItemUomConv(integer, integer, numeric, integer, numeric, boolean, integer[])
  RETURNS integer AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemId ALIAS FOR $1;
  pFromUomId ALIAS FOR $2;
  pFromValue ALIAS FOR $3;
  pToUomId ALIAS FOR $4;
  pToValue ALIAS FOR $5;
  pFractional ALIAS FOR $6;
  pUomTypes ALIAS FOR $7;
  _p RECORD;
  _fromUomId INTEGER;
  _fromValue NUMERIC;
  _toUomId INTEGER;
  _toValue NUMERIC;
  _fractional BOOLEAN;
  _seq INTEGER;
  _i INTEGER;
  _uomtype TEXT;

BEGIN
-- Make sure we have some itemtypes
  IF (pUomTypes IS NULL) OR (ARRAY_UPPER(pUomTypes,1) = 0) THEN
	RAISE EXCEPTION ''You must include at least one item type.'';
  END IF;

-- If this is a global UOM, over-ride with global data.
  SELECT * INTO _p
  FROM uomconv
  WHERE ((((uomconv_from_uom_id=pFromUomId)
  AND (uomconv_to_uom_id=pToUomId))
  OR ((uomconv_from_uom_id=pToUomId)
  AND (uomconv_to_uom_id=pFromUomId))));

  IF (FOUND) THEN
    _fromUomId := _p.uomconv_from_uom_id;
    _toUomId := _p.uomconv_to_uom_id;
    _fromValue := _p.uomconv_from_value;
    _toValue := _p.uomconv_to_value;
    _fractional := _p.uomconv_fractional;
    RAISE NOTICE ''Defaulted to global Unit of Measure conversion ratios.'';
  ELSE
    _fromUomId := pFromUomId;
    _fromValue := pFromValue;
    _toUomId := pToUomId;
    _toValue := pToValue;
    _fractional := pFractional;
  END IF;

-- See if an item conversion exists going the other way
  SELECT f.uom_name AS f_uom, t.uom_name as t_uom INTO _p
  FROM itemuomconv,uom f, uom t
  WHERE ((itemuomconv_item_id=pItemId)
  AND (itemuomconv_from_uom_id=_toUomId)
  AND (itemuomconv_to_uom_id=_fromUomId)
  AND (f.uom_id=itemuomconv_from_uom_id)
  AND (t.uom_id=itemuomconv_to_uom_id));
  IF (FOUND) THEN
    RAISE EXCEPTION ''Unit of measure conversion already exists going from % to %.'',_p.f_uom,_p.t_uom;
  END IF;

-- See if an item conversion record exists
  SELECT * INTO _p
  FROM itemuomconv
  WHERE ((itemuomconv_item_id=pItemId)
  AND (itemuomconv_from_uom_id=_fromUomId)
  AND (itemuomconv_to_uom_id=_toUomId));

-- Update if found
  IF (FOUND) THEN
    UPDATE itemuomconv SET
      itemuomconv_from_value=_fromValue,
      itemuomconv_to_value=_toValue,
      itemuomconv_fractional=_fractional
    WHERE (itemuomconv_id=_p.itemuomconv_id);
    _seq := _p.itemuomconv_id;
    
    --Delete old type list
    DELETE FROM itemuom WHERE itemuom_itemuomconv_id=_p.itemuomconv_id;
  ELSE
  
-- Otherwise create a new one
    SELECT NEXTVAL(''itemuomconv_itemuomconv_id_seq'') INTO _seq;
    INSERT INTO itemuomconv VALUES
      (_seq, pItemId,_fromUomId,_fromValue,_toUomId,_toValue,_fractional);
  END IF;
  
-- Build new type list
  FOR _i IN 1..ARRAY_UPPER(pUomTypes,1)
  LOOP
    SELECT uomtype_name INTO _uomtype
    FROM itemuomconv, itemuom, uomtype
    WHERE ((itemuom_uomtype_id=uomtype_id)
    AND (itemuomconv_id=itemuom_itemuomconv_id)
    AND (itemuomconv_item_id=pItemId)
    AND (uomtype_name != ''Selling'')
    AND (itemuom_uomtype_id=pUomTypes[_i]));
    IF (FOUND) THEN
      RAISE EXCEPTION ''Unit of Measure Type % is already used on this item'',_uomtype;
    ELSE
      INSERT INTO itemuom (itemuom_itemuomconv_id,itemuom_uomtype_id)
      VALUES (_seq,pUomTypes[_i]);
    END IF;
  END LOOP;
  
  RETURN _seq;
END;
' LANGUAGE 'plpgsql';
