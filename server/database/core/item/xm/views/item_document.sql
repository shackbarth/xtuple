SELECT dropIfExists('VIEW', 'item_document', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.item_document AS

-- documents assigned to items

SELECT	docass_id 				AS id,
	docass_source_id 			AS item,
	docass_target_id 			AS target,
	datatype_id 				AS target_type,
	docass_purpose 				AS purpose
  FROM	docass
  JOIN	private.datatype ON (docass_target_type = datatype_source)
 WHERE	(docass_source_type = 'I')

 UNION	ALL

-- items assigned to documents (inverse)

SELECT	docass_id 				AS id,
	docass_target_id 			AS item,
	docass_source_id 			AS target,
	datatype_id 				AS target_type,
	CASE
	  WHEN docass_purpose = 'A' THEN 'C'
	  WHEN docass_purpose = 'C' THEN 'A'
	  ELSE docass_purpose
	END					AS purpose
  FROM	docass
  JOIN	private.datatype ON (docass_source_type = datatype_source)
 WHERE	(docass_target_type = 'I')

 UNION	ALL

-- images assigned to items

SELECT	imageass_id 						AS id,
	imageass_source_id 					AS item,
	imageass_image_id					AS target,
	private.get_id('datatype','datatype_name','Image')	AS target_type,
	imageass_purpose 					AS purpose
  FROM	imageass
 WHERE	imageass_source = 'I';

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.item_document
    DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_CREATE_DOC" AS ON INSERT TO xm.item_document
 WHERE new.target_type != private.get_id('datatype','datatype_name','Image')
    DO INSTEAD

INSERT INTO docass (
  docass_id,
  docass_source_id,
  docass_source_type,
  docass_target_id,
  docass_target_type,
  docass_purpose)
VALUES (
  new.id,
  new.item,
  'I',
  new.target,
  (SELECT datatype_source
    FROM private.datatype
   WHERE datatype_id = new.target_type),
  new.purpose);

CREATE OR REPLACE RULE "_CREATE_IMG" AS ON INSERT TO xm.item_document
 WHERE new.target_type = private.get_id('datatype','datatype_name','Image')
    DO INSTEAD

INSERT INTO imageass (
  imageass_id,
  imageass_source_id,
  imageass_source,
  imageass_image_id,
  imageass_purpose)
VALUES (
  new.id,
  new.item,
  'I',
  new.target,
  new.purpose);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.item_document
  DO INSTEAD NOTHING;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.item_document
  DO INSTEAD NOTHING;

CREATE OR REPLACE RULE "_DELETE_DOC" AS ON DELETE TO xm.item_document
 WHERE old.target_type != private.get_id('datatype','datatype_name','Image')
    DO INSTEAD

DELETE FROM docass
 WHERE (docass_id = old.id);

CREATE OR REPLACE RULE "_DELETE_IMG" AS ON DELETE TO xm.item_document
 WHERE old.target_type = private.get_id('datatype','datatype_name','Image')
    DO INSTEAD

DELETE FROM imageass
 WHERE (imageass_id = old.id);