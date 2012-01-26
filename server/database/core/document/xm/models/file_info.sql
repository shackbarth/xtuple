select private.create_model(

-- Model name, schema, table

'file_info', 'public', 'file',

-- Columns

E'{
  "file.file_id as guid",
  "file.file_title as name"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.file_info
  do instead nothing;

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.file_info
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.file_info
  do instead nothing;

"}',

-- Conditions, Comment, System, Nested

'{}', 'File Info Model', true, true);
