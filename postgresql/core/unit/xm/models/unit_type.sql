select private.create_model(

-- Model name, schema, table

'unit_type', 'public', 'uomtype',

-- Columns

E'{
  "uomtype.uomtype_id as guid",
  "uomtype.uomtype_name as \\"name\\"",
  "uomtype.uomtype_descrip as description",
  "uomtype.uomtype_multiple as multiple"
}',

-- sequence

'public.uomtype_uomtype_id_seq',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.unit_type
  do instead nothing;

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.unit_type
  do instead nothing;

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.unit_type
  do instead nothing;

"}',

-- Conditions, Comment, System

'{}', 'Unit Type Model', true, true);
