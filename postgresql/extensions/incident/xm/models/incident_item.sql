select private.create_model(

-- Model name, schema

'incident_item', '', 'xm.item_info, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "item_info as item",
  "docinfo.purpose as purpose"
}',

-- sequence

'public.docass_docass_id_seq',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.incident_item
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
  (new.item).guid,
  \'I\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.incident_item
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.incident_item
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"item_info.guid=target_id","docinfo.source_type=\'INCDT\'","docinfo.target_type=\'I\'"}', 'Incident Item Model', true, true);