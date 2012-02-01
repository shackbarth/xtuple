select private.create_model(

-- Model name, schema, table

'project_info', 'public', 'prj',

-- Columns

E'{
  "prj.prj_id as guid",
  "prj.prj_number as number",
  "prj.prj_name as name",
  "prj.prj_status as project_status"}', 

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.project_info
  do instead nothing;

","

-- update rule
  
create or replace rule \\"_UPDATE\\" as on update to xm.project_info
  do instead nothing;

","

-- delete rule
  
create or replace rule \\"_DELETE\\" as on delete to xm.project_info
  do instead nothing;

"}',

-- Conditions, Comment, System

'{}', 'Project Info Model', true, true, '', '', 'public.prj_prj_id_seq');