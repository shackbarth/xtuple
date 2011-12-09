SELECT dropIfExists('VIEW', 'unit_type', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.unit_type AS

SELECT	uomtype_id 			AS id,
	uomtype_name 			AS "name",
	uomtype_descrip 		AS description,
	uomtype_multiple 		AS multiple
  FROM	uomtype;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.unit_type
  DO INSTEAD NOTHING;

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.unit_type
  DO INSTEAD NOTHING;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.unit_type
  DO INSTEAD NOTHING;