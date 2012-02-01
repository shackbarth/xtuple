select private.create_model(

-- Model name, schema, table

'file', 'public', 'file',

-- Columns

E'{
  "file.file_id as guid",
  "file.file_title as name",
  "file.file_stream as data"
}',

-- sequence

'public.file_file_id_seq',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.file
  do instead

insert into file (
  file_id,
  file_title,
  file_stream )
values (
  new.guid,
  new.name,
  new.data );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.file
  do instead

update file set
  file_title = new.name
where ( file_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.file
  do instead 
  
delete from file
where ( file_id = old.guid );

"}',

-- Conditions, Comment, System

'{}', 'File Model', true, false, 'FILE');
