SELECT dropIfExists('VIEW', 'item_conversion', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.item_conversion AS

SELECT	itemuomconv_id 								AS id,
	itemuomconv_item_id 							AS item,
	itemuomconv_from_uom_id 						AS from_unit,
	itemuomconv_from_value 							AS from_value,
	itemuomconv_to_uom_id 							AS to_unit,
	itemuomconv_to_value 							AS to_value,
	itemuomconv_fractional 							AS fractional,
	BTRIM(ARRAY(
	  SELECT itemuom_id
	    FROM itemuom
	   WHERE itemuom_itemuomconv_id = itemuomconv_id)::TEXT,'{}')		AS unit_types
  FROM	itemuomconv;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.item_conversion
  DO INSTEAD

INSERT INTO itemuomconv (
  itemuomconv_id,
  itemuomconv_item_id,
  itemuomconv_from_uom_id,
  itemuomconv_from_value,
  itemuomconv_to_uom_id,
  itemuomconv_to_value,
  itemuomconv_fractional)
VALUES (
  new.id,
  new.item,
  new.from_unit,
  new.from_value,
  new.to_unit,
  new.to_value,
  new.fractional);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.item_conversion
  DO INSTEAD

UPDATE 	itemuomconv 
   SET	itemuomconv_from_value 		= new.from_value,
	itemuomconv_to_value		= new.to_value,
	itemuomconv_fractional		= new.fractional
 WHERE	itemuomconv_id 			= old.id;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.item_conversion
  DO INSTEAD (

DELETE FROM itemuom
 WHERE (itemuom_itemuomconv_id = old.id);

DELETE FROM itemuomconv
 WHERE (itemuomconv_id = old.id);

)