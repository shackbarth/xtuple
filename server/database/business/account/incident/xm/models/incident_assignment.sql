select private.create_model(

-- Model name, schema, table

'incident_assignment', '', 'xm.incident_info, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "docinfo.source_type as source_type",
  "docinfo.purpose as purpose",
  "incident_info as incident"
}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.incident_assignment 
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
  new.source_type,
  (new.incident).guid,
  \'INCDT\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.incident_assignment 
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.incident_assignment 
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"incident_info.guid=target_id","docinfo.target_type=\'INCDT\'"}', 'Incident Assignment Model', true, true);