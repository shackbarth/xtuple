SELECT dropIfExists('VIEW', 'item', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.item AS

SELECT	item_id								AS id,
	item_number							AS "number",
	item_active							AS is_active,
	item_descrip1							AS description1,
	item_descrip2							AS description2,
	item_classcode_id						AS class_code,
	item_inv_uom_id							AS inventory_unit,
	item_picklist							AS is_picklist,
	item_comments							AS notes,
	item_sold							AS is_sold,
	item_fractional							AS is_fractional,
	item_type							AS "type",
	item_prodweight							AS product_weight,
	item_packweight							AS package_weight,
	item_prodcat_id							AS product_category,
	item_exclusive							AS is_exclusive,
	item_listprice							AS list_price,
	item_price_uom_id						AS price_unit,
	item_config							AS is_configured,
	item_extdescrip							AS extended_description,
	item_upccode							AS barcode,
	item_warrdays							AS warranty_days,
	item_freightclass_id						AS freight_class,
	item_maxcost							AS max_cost,
	BTRIM(ARRAY(
          SELECT comment_id
            FROM "comment"
           WHERE comment_source_id = item_id
	         AND comment_source = 'I')::TEXT,'{}') 		AS "comments",
	BTRIM(ARRAY(
          SELECT charass_id 
            FROM charass
           WHERE charass_target_id = item_id
             AND charass_target_type = 'I')::TEXT,'{}') 		AS "characteristics",
        BTRIM(ARRAY(
          SELECT itemuomconv_id
            FROM itemuomconv
           WHERE itemuomconv_item_id = item_id)::TEXT,'{}') 		AS conversions,
        BTRIM(ARRAY(
          SELECT itemalias_id
            FROM itemalias
           WHERE itemalias_item_id = item_id)::TEXT,'{}') 		AS aliases,
	BTRIM(ARRAY(
          SELECT itemsub_id 
            FROM itemsub
           WHERE itemsub_parent_item_id = item_id)::TEXT,'{}') 	AS substitutes,
        BTRIM(ARRAY(
    	  SELECT docass_id 
	    FROM docass
	   WHERE docass_target_id = item_id 
	     AND docass_target_type = 'I'
	   UNION ALL
	  SELECT docass_id 
	    FROM docass
	   WHERE docass_source_id = item_id 
	     AND docass_source_type = 'I'
	   UNION ALL
	  SELECT imageass_id 
	    FROM imageass
	   WHERE imageass_source_id = item_id 
	     AND imageass_source = 'I')::TEXT,'{}') 			AS documents
  FROM	item;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.item
  DO INSTEAD

INSERT INTO item (
  item_id,
  item_number,
  item_active,
  item_descrip1,
  item_descrip2,
  item_classcode_id,
  item_inv_uom_id,
  item_picklist,
  item_comments,
  item_sold,
  item_fractional,
  item_type,
  item_prodweight,
  item_packweight,
  item_prodcat_id,
  item_exclusive,
  item_listprice,
  item_price_uom_id,
  item_config,
  item_extdescrip,
  item_upccode,
  item_warrdays,
  item_freightclass_id,
  item_maxcost)
VALUES (
  new.id,
  new.number,
  new.is_active,
  new.description1,
  new.description2,
  new.class_code,
  new.inventory_unit,
  new.is_picklist,
  new.notes,
  new.is_sold,
  new.is_fractional,
  new.type,
  new.product_weight,
  new.package_weight,
  new.product_category,
  new.is_exclusive,
  new.list_price,
  new.price_unit,
  new.is_configured,
  new.extended_description,
  new.barcode,
  new.warranty_days,
  new.freight_class,
  new.max_cost);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.item
  DO INSTEAD

UPDATE 	item 
   SET	item_active				= new.is_active,
	item_descrip1				= new.description1,
	item_descrip2				= new.description2,
	item_classcode_id			= new.class_code,
	item_inv_uom_id				= new.inventory_unit,
	item_picklist				= new.is_picklist,
	item_comments				= new.notes,
	item_sold				= new.is_sold,
	item_fractional				= new.is_fractional,
	item_type				= new.type,
	item_prodweight				= new.product_weight,
	item_packweight				= new.package_weight,
	item_prodcat_id				= new.product_category,
	item_exclusive				= new.is_exclusive,
	item_listprice				= new.list_price,
	item_price_uom_id			= new.price_unit,
	item_config				= new.is_configured,
	item_extdescrip				= new.extended_description,
	item_upccode				= new.barcode,
	item_warrdays				= new.warranty_days,
	item_freightclass_id			= new.freight_class,
	item_maxcost				= new.max_cost
 WHERE	item_id					= old.id;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.item
  DO INSTEAD (

DELETE FROM comment
 WHERE (comment_source_id = old.id
   AND comment_source = 'I');

DELETE FROM charass
 WHERE (charass_target_id = old.id
	AND charass_target_type = 'I');

DELETE FROM itemuom
 USING itemuomconv
 WHERE (itemuom_itemuomconv_id = itemuomconv_id
	AND itemuomconv_item_id = old.id);

DELETE FROM itemuomconv
 WHERE (itemuomconv_item_id = old.id);

DELETE FROM itemalias
 WHERE (itemalias_item_id = old.id);

DELETE FROM itemsub
 WHERE (itemsub_parent_item_id = old.id);

DELETE FROM docass
 WHERE (docass_target_id = old.id
	AND docass_target_type = 'I')
    OR
       (docass_source_id = old.id
       AND docass_source_type = 'I');

DELETE FROM imageass
 WHERE ( imageass_source_id = old.id
	AND imageass_source = 'I' );

DELETE FROM item
 WHERE (item_id = old.id);

)