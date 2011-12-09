SELECT dropIfExists('VIEW', 'item_conversion_type_assignment', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.item_conversion_type_assignment AS

SELECT	itemuom_id 			AS id,
	itemuom_itemuomconv_id 		AS item_conversion,
	itemuom_uomtype_id 		AS unit_type
  FROM	itemuom;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.item_conversion_type_assignment
  DO INSTEAD

INSERT INTO itemuom (
  itemuom_id,
  itemuom_itemuomconv_id,
  itemuom_uomtype_id)
VALUES (
  new.id,
  new.item_conversion,
  new.unit_type);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.item_conversion_type_assignment
  DO INSTEAD NOTHING;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.item_conversion_type_assignment
  DO INSTEAD (

DELETE FROM itemuom
 WHERE (itemuom_id = old.id);

)