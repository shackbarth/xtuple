select private.create_model(

-- Model name, schema, table

'privilege', 'public', 'priv',

-- Columns

E'{
  "priv.priv_id as guid",
  "priv.priv_module as module",
  "priv.priv_name as name",
  "priv.priv_descrip as description"}',
     
-- sequence

'public.priv_priv_id_seq',

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