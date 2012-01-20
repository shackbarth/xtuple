select private.create_model(

-- Model name, schema, table

'account_document', 'xm', 'document_assignment',

-- Columns

E'{
  "document_assignment.guid as guid",
  "document_assignment.source as account",
  "document_assignment.target as target",
  "document_assignment.purpose as purpose",
  "document_assignment.source_type as source_type",
  "document_assignment.target_type as target_type"
}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.account_document do instead

insert into xm.document_assignment (
  guid,
  source,
  target,
  source_type,
  target_type,
  purpose)
values (
  new.guid,
  new.account,
  new.target,
  new.source_type,
  new.target_type,
  new.purpose);

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.account_document 
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.account_document do instead

delete from xm.document_assignment
where ( guid = old.guid );

"}',

-- Conditions, Comment, System

E'{"private.get_datatype_source(source_type) = \'CRMA\'","private.get_datatype_source(target_type) = \'CRMA\'"}', 'Account Document Model', true, true);
