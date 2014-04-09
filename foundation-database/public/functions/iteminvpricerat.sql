CREATE OR REPLACE FUNCTION itemInvPriceRat(INTEGER) RETURNS NUMERIC STABLE AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pItemid ALIAS FOR $1;
  _fromUomid INTEGER;
  _toUomid INTEGER;
  _ratio NUMERIC;
BEGIN

  IF(pItemid IS NULL) THEN
    RETURN 1.0;
  END IF;

  SELECT item_inv_uom_id, item_price_uom_id
    INTO _fromUomid, _toUomid
    FROM item
   WHERE(item_id=pItemid);

  IF(NOT FOUND) THEN
    RAISE EXCEPTION ''No item record found for item_id %'', pItemid;
  END IF;

  IF(_fromUomid = _toUomid) THEN
    RETURN 1.0;
  END IF;

  -- Return the ration as inventory / price
  SELECT CASE WHEN(itemuomconv_from_uom_id=_fromUomid) THEN itemuomconv_from_value / itemuomconv_to_value
              ELSE itemuomconv_to_value / itemuomconv_from_value
         END
    INTO _ratio
    FROM itemuomconv
   WHERE((((itemuomconv_from_uom_id=_fromUomid) AND (itemuomconv_to_uom_id=_toUomid))
       OR ((itemuomconv_from_uom_id=_toUomid) AND (itemuomconv_to_uom_id=_fromUomid)))
     AND (itemuomconv_item_id=pItemid));

  IF(NOT FOUND) THEN
    RAISE EXCEPTION ''No itemuomconv record found for item_id % to item_price_uomid %'', pItemid, _toUomid;
  END IF;
  
  RETURN _ratio;
END;
' LANGUAGE 'plpgsql';
