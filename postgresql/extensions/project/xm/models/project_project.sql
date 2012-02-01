select private.create_model(

-- Model name, schema

'project_project', '', 'xm.project_info, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "project_info as project",
  "docinfo.purpose as purpose"
}',

-- sequence

'public.docass_docass_id_seq',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.project_project
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
  \'J\',
  (new.project).guid,
  \'J\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.project_project
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.project_project
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"project_info.guid=target_id","docinfo.source_type=\'J\'","docinfo.target_type=\'J\'"}', 'Project Project Model', true, true);