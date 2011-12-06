SELECT dropIfExists('VIEW', 'project_info', 'xm');

-- return rule

CREATE OR REPLACE VIEW xm.project_info AS

SELECT id,
       "number",
       "name",
       project_status
  FROM xm.project;

-- insert rule

CREATE OR REPLACE RULE "_CREATE" AS ON INSERT TO xm.project_info
  DO INSTEAD NOTHING;

-- update rule

CREATE OR REPLACE RULE "_UPDATE" AS ON UPDATE TO xm.project_info
  DO INSTEAD NOTHING;

-- delete rule

CREATE OR REPLACE RULE "_DELETE" AS ON DELETE TO xm.project_info
  DO INSTEAD NOTHING;