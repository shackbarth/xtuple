-- BEGIN xm.item model view test queries

	-- insert rule testing

		INSERT INTO xm.item (
		  guid,
		  "number",
		  is_active,
		  description1,
		  description2,
		  class_code,
		  inventory_unit,
		  is_picklist,
		  notes,
		  is_sold,
		  is_fractional,
		  "type",
		  product_weight,
		  package_weight,
		  product_category,
		  is_exclusive,
		  list_price,
		  price_unit,
		  is_configured,
		  extended_description,
		  barcode,
		  warranty_days,
		  freight_class,
		  max_cost)
		VALUES (
		  99999,
		  '99999',
		  true,
		  'item description 1',
		  'item description 2',
		  (select min(classcode_id) from classcode),
		  (select min(uom_id) from uom),
		  true,
		  'item notes',
		  true,
		  true,
		  'P',
		  999,
		  0.999,
		  (select min(prodcat_id) from prodcat),
		  true,
		  9999.9999,
		  (select max(uom_id) from uom),
		  true,
		  'item extended description',
		  '12345-67890',
		  99,
		  (select min(freightclass_id) from freightclass),
		  999999.99);

	-- confirm INSERT record

		SELECT * 
		  FROM xm.item 
		 WHERE guid = 99999;

	-- update rule testing

		-- if "type" is updated, all cost and weight values will be set to 0.00 per
		-- item table trigger

		UPDATE xm.item
		   SET  is_active			= false,
			description1			= '***updated item description 1',
			description2			= '***updated item description 2',
			class_code			= (select max(classcode_id) from classcode),
			inventory_unit			= (select (min(uom_id) +1) from uom),
			is_picklist			= false,
			notes				= '***updated item notes',
			is_sold				= false,
			is_fractional			= false,
			"type"				= 'P',
			product_weight			= 888,
			package_weight			= 0.888,
			product_category		= (select max(prodcat_id) from prodcat),
			is_exclusive			= false,
			list_price			= 8888.8888,
			price_unit			= (select (max(uom_id) -1) from uom),
			is_configured			= false,
			extended_description		= '***updated extended description',
			barcode				= 'xxxxxx-xxxxxx',
			warranty_days			= 0,
			freight_class			= (select max(freightclass_id) from freightclass),
			max_cost			= 888888.88
		 WHERE guid 				= 99999;

-- END xm.item model view test queries

-- BEGIN xm.item_alias model view test queries

	-- insert rule testing

		INSERT INTO xm.item_alias (
		  guid,
		  item,
		  "number",
		  use_description,
		  description1,
		  description2,
		  notes)
		VALUES (
		  99999,
		  99999,
		  'ALIAS-12345',
		  true,
		  'description1 INSERT',
		  'description2 INSERT',
		  'notes INSERT');

	-- confirm INSERT record

		SELECT * 
		  FROM xm.item_alias
		 WHERE guid = 99999;

	-- update rule testing

		UPDATE 	xm.item_alias
		   SET  use_description	= false,
		   	description1		= '***description1 UPDATE',
			description2		= '***description2 UPDATE',
			notes			= '***notes UPDATE'
		 WHERE  guid 			= 99999;

	 -- delete rule testing

		DELETE FROM xm.item_alias
		 WHERE guid = 99999;

-- END xm.item_alias model view test queries

-- BEGIN xm.item_characteristic model view test queries

	-- insert rule testing

		INSERT INTO xm.item_characteristic (
		  guid,
		  item,
		  characteristic,
		  "value",
		  is_default,
		  price)
		VALUES (
		  99999,
		  99999,
		  (select characteristic from xm.characteristic  where is_items order by guid limit 1),
		  'value INSERT',
		  false,
		  0);

	-- confirm INSERT record

		SELECT * 
		  FROM xm.item_characteristic
		 WHERE guid = 99999;

	-- update rule testing

		UPDATE 	xm.item_characteristic
		   SET 	characteristic		= (select characteristic from xm.characteristic  where is_items order by guid desc limit 1),
			"value"			= '**value UPDATE**',
			is_default		= true
		 WHERE 	guid 			= 99999;

	 -- delete rule testing

		DELETE FROM xm.item_characteristic
		 WHERE guid = 99999;

-- END xm.item_characteristic model view test queries

-- BEGIN xm.item_comment model view test queries

	-- insert rule testing

		INSERT INTO xm.item_comment (
		  guid,
		  item,
		  "date",
		  "username",
		  comment_type,
		  "text",
		  is_public)
		VALUES (
		  99999,
		  99999,
		  now(),
		  'mwall',
		  (select cmnttype_id from cmnttype where cmnttype_name = 'Sales'),
		  'comment text INSERT',
		  false);

	-- confirm INSERT record

		SELECT * 
		  FROM xm.item_comment
		 WHERE guid = 99999;

	-- update rule testing

		UPDATE xm.item_comment
		   SET 	"text"			= '***comment_text_UPDATE',
			is_public		= true
		 WHERE 	guid 			= 99999;

	 -- delete rule testing (should do NOTHING)

		DELETE FROM xm.item_comment
		 WHERE guid = 99999;

-- END xm.item_comment model view test queries

-- BEGIN xm.item_document model view test queries

	-- insert rule testing (Docass)

		INSERT INTO xm.contact_assignment (
		  guid,
		  source,
		  source_type,
		  contact,
		  purpose)
		VALUES (
		  99999,
		  99999,
		  'I',
		  (select contact_info from xm.contact_info order by guid limit 1),
		  'S');

		INSERT INTO xm.item_assignment (
		  guid,
		  source,
		  source_type,
		  item,
		  purpose)
		VALUES (
		  99998,
		  99999,
		  'I',
		  (select item_info from xm.item_info order by guid limit 1),
		  'S');

	-- insert rule testing (Imageass)

		INSERT INTO xm.image_assignment (
		  guid,
		  source,
		  source_type,
		  image,
		  purpose)
		VALUES (
		  99997,
		  99999,
		  'I',
		  (select image_info from xm.image_info order by guid limit 1),
		  'S');

	-- confirm INSERT record

		SELECT * 
		  FROM private.docinfo
		 WHERE id IN (99999,99998,99997,99996);

	-- NO update rule functionality for the xm.item_document model view


-- END xm.item_document model view test queries

-- BEGIN xm.item_substitute model view test queries

	-- insert rule testing

		INSERT INTO xm.item_substitute (
		  guid,
		  root_item,
		  substitute_item,
		  conversion_ratio,
		  rank)
		VALUES (
		  99999,
		  99999,
		  (SELECT MIN(item_id)
		     FROM item),
		  1.0,
		  1);

	-- confirm INSERT record

		SELECT * 
		  FROM xm.item_substitute
		 WHERE guid = 99999;

	-- update rule testing

		UPDATE 	xm.item_substitute
		   SET	substitute_item		= (SELECT (MIN(item_id + 1 ))
						     FROM item),
			conversion_ratio	= .5,
			rank			= 10
		 WHERE 	guid 			= 99999;

	 -- delete rule testing

		DELETE FROM xm.item_substitute
		 WHERE guid = 99999;

-- END xm.item_substitute model view test queries

-- BEGIN xm.item_conversion model view test queries

	-- insert rule testing

		INSERT INTO xm.item_conversion (
		  guid,
		  item,
		  from_unit,
		  from_value,
		  to_unit,
		  to_value,
		  fractional)
		VALUES (
		  99999,
		  99999,
		  4,
		  1.0,
		  12,
		  2.0,
		  false);

	-- confirm INSERT record

		SELECT * 
		  FROM xm.item_conversion
		 WHERE guid = 99999;

	-- update rule testing

		UPDATE 	xm.item_conversion
		   SET 	from_value		= 2.0,
			to_value		= 1.0,
			fractional		= true
		 WHERE 	guid 			= 99999;

-- END xm.item_conversion model view test queries

-- BEGIN xm.item_conversion_type_assignment model view test queries

	-- insert rule testing

		INSERT INTO xm.item_conversion_type_assignment (
		  guid,
		  item_conversion,
		  unit_type)
		VALUES (
		  99999,
		  99999,
		  1);

	-- confirm INSERT record

		SELECT * 
		  FROM xm.item_conversion_type_assignment
		 WHERE guid = 99999;

	-- update rule testing

		-- There is no UPDATE functionality

	 -- delete rule testing

		DELETE FROM xm.item_conversion_type_assignment
		 WHERE guid = 99999;

	-- delete rule testing

		DELETE FROM xm.item_conversion
		 WHERE guid = 99999;

-- END xm.item_conversion_type_assignment model view test queries

-- BEGIN xm.item_info model view test queries

	SELECT *
	  FROM xm.item_info;

-- END xm.item_info model view test queries

-- delete rule testing

        DELETE FROM xm.item
        WHERE guid = 99999;