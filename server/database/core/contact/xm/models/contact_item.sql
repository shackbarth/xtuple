select private.create_model(

-- Model name, schema

'contact_item', '', 'xm.item_info, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "item_info as item",
  "docinfo.purpose as purpose"
}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.contact_item
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
  \'T\',
  (new.item).guid,
  \'I\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.contact_item
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.contact_item
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"item_info.guid=target_id","docinfo.source_type=\'T\'","docinfo.target_type=\'I\'"}', 'Contact Item Model', true, true);