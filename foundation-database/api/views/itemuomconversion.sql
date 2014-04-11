-- Item UOM Conversion

SELECT dropIfExists('VIEW', 'itemuomconversion', 'api');
CREATE VIEW api.itemuomconversion
AS 
   SELECT 
     item_number::varchar AS item_number,
     f.uom_name::varchar AS uom,
     itemuomconv_from_value AS uom_value,
     p.uom_name AS per_uom,
     itemuomconv_to_value AS per_uom_value,
     itemuomconv_fractional AS fractional,
     fetchItemUomConvTypes(itemuomconv_id) AS selected_types
   FROM item, itemuomconv, uom f, uom p
   WHERE ((item_id=itemuomconv_item_id)
   AND (itemuomconv_from_uom_id=f.uom_id)
   AND (itemuomconv_to_uom_id=p.uom_id));

GRANT ALL ON TABLE api.itemuomconversion TO xtrole;
COMMENT ON VIEW api.itemuomconversion IS 'Item Unit of Measure Conversion';

--Rules

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO api.itemuomconversion DO INSTEAD

  SELECT saveItemUomConv(
    getItemId(NEW.item_number),
    COALESCE(getUomId(NEW.uom),(
      SELECT item_inv_uom_id
      FROM item
      WHERE (item_id=getItemId(NEW.item_number)))),
    COALESCE(NEW.uom_value,1),
    COALESCE(getUomId(NEW.per_uom),(
      SELECT item_inv_uom_id
      FROM item
      WHERE (item_id=getItemId(NEW.item_number)))),
    COALESCE(NEW.per_uom_value,1),
    COALESCE(NEW.fractional,false),
    getUomTypeId(NEW.selected_types));

CREATE OR REPLACE RULE "_UPDATE" AS 
    ON UPDATE TO api.itemuomconversion DO INSTEAD

  SELECT saveItemUomConv(
    getItemId(NEW.item_number),
    COALESCE(getUomId(NEW.uom),(
      SELECT item_inv_uom_id
      FROM item
      WHERE (item_id=getItemId(NEW.item_number)))),
    COALESCE(NEW.uom_value,1),
    COALESCE(getUomId(NEW.per_uom),(
      SELECT item_inv_uom_id
      FROM item
      WHERE (item_id=getItemId(NEW.item_number)))),
    COALESCE(NEW.per_uom_value,1),
    COALESCE(NEW.fractional,false),
    getUomTypeId(NEW.selected_types));
           
CREATE OR REPLACE RULE "_DELETE" AS 
    ON DELETE TO api.itemuomconversion DO INSTEAD

  SELECT deleteitemuomconv(itemuomconv_id)
  FROM itemuomconv
  WHERE ((itemuomconv_item_id=getItemId(OLD.item_number))
  AND (((itemuomconv_from_uom_id=getUomId(OLD.uom))
  AND (itemuomconv_to_uom_id=getUomId(OLD.per_uom)))
  OR ((itemuomconv_from_uom_id=getUomId(OLD.per_uom))
  AND (itemuomconv_to_uom_id=getUomId(OLD.uom)))));
