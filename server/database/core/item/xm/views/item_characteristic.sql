SELECT dropIfExists('VIEW', 'item_characteristic', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.item_characteristic AS

SELECT	charass_id 		AS id,
	charass_target_id 	AS item,
	charass_char_id 	AS characteristic,
	charass_value 		AS "value",
	charass_default		AS default_value
  FROM	charass
 WHERE	(charass_target_type = 'I');

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.item_characteristic
  DO INSTEAD

INSERT INTO charass (
  charass_id,
  charass_target_id,
  charass_target_type,
  charass_char_id,
  charass_value,
  charass_default)
VALUES (
  new.id,
  new.item,
  'I',
  new.characteristic,
  new.value,
  new.default_value);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.item_characteristic
  DO INSTEAD

UPDATE 	charass 
   SET	charass_char_id 	= new.characteristic,
	charass_value		= new.value,
	charass_default		= new.default_value
 WHERE	charass_id 		= old.id;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.item_characteristic
  DO INSTEAD (

DELETE FROM charass
 WHERE (charass_id = old.id);

)