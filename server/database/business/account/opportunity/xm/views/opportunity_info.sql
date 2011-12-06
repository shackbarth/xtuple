SELECT dropIfExists('VIEW', 'opportunity_info', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.opportunity_info AS

SELECT id,
       "number",
       "name",
       is_active
  FROM xm.opportunity;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.opportunity_info
  DO INSTEAD NOTHING;

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.opportunity_info
  DO INSTEAD NOTHING;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.opportunity_info
  DO INSTEAD NOTHING;