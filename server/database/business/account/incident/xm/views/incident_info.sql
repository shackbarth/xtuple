select private.create_model(

-- Model name, schema, table

'incident_info', 'public', 'incdt',

-- Columns

E'{
  "incdt.incdt_id as id",
  "incdt.incdt_number as \\"number\\"",
  "incdt.incdt_summary as \\"name\\"",
  "incdt.incdt_status != \'L\' as is_active"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.incident_info 
  do instead nothing;

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.incident_info
  do instead nothing;

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.incident_info   
  do instead nothing;

"}',

-- Conditions, Comment, System

'{}', 'Incident Info Model', true);
