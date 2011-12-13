SELECT dropIfExists('VIEW', 'user_info', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.user_info AS

SELECT	username,
	is_active,
	propername
  FROM	xm.user;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.user_info
  DO INSTEAD NOTHING;

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.user_info
  DO INSTEAD NOTHING;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.user_info
  DO INSTEAD NOTHING;