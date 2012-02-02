select private.create_model(

-- Model name, schema

'item_file', '', 'xm.file_info, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "file_info as file",
  "docinfo.purpose as purpose"
}',

-- sequence

'public.docass_docass_id_seq',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.item_file
  do instead

insert into private.docinfo (
  id,
  source_id,
  source_type,
  target_id,
  target_type,
  purpose )
values (
  new.guid,
  new.source,
  \'I\',
  (new.file).guid,
  \'FILE\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.item_file
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.item_file
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"file_info.guid=target_id","docinfo.source_type=\'I\'","docinfo.target_type=\'FILE\'"}', 'Item File Model', true, true );