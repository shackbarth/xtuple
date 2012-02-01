select private.create_model(

-- Model name, schema

'incident_url', '', 'xm.url, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "url as url",
  "docinfo.purpose as purpose"
}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.incident_url
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
  (new.url).guid,
  \'URL\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.incident_url
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.incident_url
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"url.guid=target_id","docinfo.source_type=\'INCDT\'","docinfo.target_type=\'URL\'"}', 'Incident Url Model', true, true, '', '', 'public.docass_docass_id_seq');