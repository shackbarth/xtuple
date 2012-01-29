select private.create_model(

-- Model name, schema

'incident_incident', '', 'xm.account_info, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "account_info as account",
  "docinfo.purpose as purpose"
}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.incident_incident
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
  \'INCDT\',
  (new.account).guid,
  \'INCDT\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.incident_incident
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.incident_incident
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"account_info.guid=target_id","docinfo.source_type=\'INCDT\'","docinfo.target_type=\'INCDT\'"}', 'Incident Incident Model', true, true);