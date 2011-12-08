SELECT dropIfExists('VIEW', 'item_info', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.item_info AS

SELECT	id,
	"number",
	description1,
	description2,
	"type",
	barcode,
	is_active
  FROM	xm.item;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.item_info
  DO INSTEAD NOTHING;

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.item_info
  DO INSTEAD NOTHING;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.item_info
  DO INSTEAD NOTHING;