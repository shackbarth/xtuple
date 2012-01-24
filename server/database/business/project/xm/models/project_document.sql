select private.create_model(

-- Model name, schema, table

'project_document', '', 'xm.document_assignment',

-- Columns

E'{
  "document_assignment.id as guid",
  "document_assignment.source as project",
  "document_assignment.target as target",
  "document_assignment.target_type as target_type",
  "document_assignment.purpose as purpose"}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.project_document do instead

insert into xm.document_assignment (
  id,
  source,
  target,
  source_type,
  target_type,
  purpose)
values (
  new.guid,
  new.project,
  new.target,
  private.get_id(\'datatype\', \'datatype_source\', \'J\'),
  new.target_type,
  new.purpose
);

","
  
-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.project_document 
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.project_document do instead

delete from xm.document_assignment
where ( id = old.guid );

"}', 

-- Conditions, Comment, System
E'{"private.get_datatype_source(source_type) = \'J\'"}', 'Project Document Model', true, true);
