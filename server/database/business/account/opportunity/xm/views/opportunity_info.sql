select private.create_model(

-- Model name, schema, table

'opportunity_info', 'public', 'ophead',

-- Columns

E'{
  "ophead.ophead_id as id",
  "ophead.ophead_number as \\"number\\"",
  "ophead.ophead_name as \\"name\\"",
  "ophead.ophead_active as is_active"}',

-- Rules

E'{"
-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.opportunity_info
  do instead nothing;

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.opportunity_info
  do instead nothing;

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.opportunity_info
  do instead nothing;

"}',

-- Conditions, Comment, System

'{}', 'Opporunity Info Model', true);
