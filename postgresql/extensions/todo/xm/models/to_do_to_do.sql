select private.create_model(

-- Model name, schema

'to_do_to_do', '', 'xm.to_do_info, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "to_do_info as to_do",
  "docinfo.purpose as purpose"
}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.to_do_to_do
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
  \'TODO\',
  (new.to_do).guid,
  \'TODO\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.to_do_to_do
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.to_do_to_do
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"to_do_info.guid=target_id","docinfo.source_type=\'TODO\'","docinfo.target_type=\'TODO\'"}', 'ToDo ToDo Model', true, true, '', '', 'public.docass_docass_id_seq');