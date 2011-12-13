SELECT dropIfExists('VIEW', 'account_info', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.account_info AS

SELECT	id,
	"number",
	"name",
	is_active
  FROM	xm.account;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.account_info
  DO INSTEAD NOTHING;

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.account_info
  DO INSTEAD NOTHING;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.account_info
  DO INSTEAD NOTHING;