SELECT dropIfExists('VIEW', 'opportunity_characteristic', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.opportunity_characteristic AS

SELECT charass_id 		 AS id,
  	   charass_target_id AS opportunity,
  	   charass_char_id 	 AS characteristic,
  	   charass_value 	 AS value
  FROM charass
 WHERE ( charass_target_type = 'OPP' );

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.opportunity_characteristic
  DO INSTEAD

INSERT INTO charass (
  charass_id,
  charass_target_id,
  charass_target_type,
  charass_char_id,
  charass_value)

VALUES (
  new.id,
  new.opportunity,
  'OPP',
  new.characteristic,
  new.value);

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.opportunity_characteristic
  DO INSTEAD

UPDATE charass
   SET charass_char_id = new.characteristic,
	   charass_value   = new.value
 WHERE ( charass_id = old.id );

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.opportunity_characteristic
  DO INSTEAD

DELETE FROM charass
 WHERE ( charass_id = old.id );