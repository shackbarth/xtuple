select private.create_model(

-- Model name, schema

'contact_image', '', 'xm.image_info, private.docinfo',

E'{
  "docinfo.id as guid",
  "docinfo.source_id as source",
  "image_info as image",
  "docinfo.purpose as purpose"
}',

-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.contact_image 
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
  (new.image).guid,
  \'IMG\',
  new.purpose );
  
","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.contact_image 
  do instead nothing;

","

-- delete rules
  
create or replace rule \\"_DELETE\\" as on delete to xm.contact_image
  do instead

delete from private.docinfo
where ( id = old.guid );


"}',

-- Conditions, Comment, System, Nested

E'{"image_info.guid=target_id","docinfo.source_type=\'T\'","docinfo.target_type=\'IMG\'"}', 'Contact Image Model', true, true);