select private.create_model(

-- Model name, schema, table

'privilege', 'public', 'priv',

-- Columns

E'{
  "priv_id as id",
  "priv_module as module",
  "priv_name as name",
  "priv_descrip as description"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.privilege
  do instead nothing;

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.privilege
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.privilege
  do instead nothing;

"}', 

-- Conditions, Comment, System

'{}', 'Privilege Model', true);