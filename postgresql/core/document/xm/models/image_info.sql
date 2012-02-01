select private.create_model(

-- Model name, schema, table

'image_info', 'public', 'image',

-- Columns

E'{
  "image.image_id as guid",
  "image.image_name as name",
  "image.image_descrip as description"
}',

-- sequence

'public.image_image_id_seq',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.image_info
  do instead nothing

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.image_info
  do instead nothing

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.image_info
  do instead nothing

"}',

-- Conditions, Comment, System, Nested

'{}', 'Image Model', true, true);
