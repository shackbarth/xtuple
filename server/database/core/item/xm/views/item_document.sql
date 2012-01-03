select private.create_model(

-- Model name, schema

'item_document', '',

-- table

E'(select
     id,
     source_id,
     target_id,
     purpose,
     datatype_id
   from docinfo
   join private.datatype on (docinfo.target_type = datatype_source)
   where docinfo.source_type = \'I\') doc',

-- Columns

E'{
  "doc.id as id",
  "doc.source_id as item",
  "doc.target_id as target",
  "doc.purpose as purpose",
  "doc.datatype_id as target_type"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.item_document
  do instead nothing;

","

create or replace rule \\"CREATE_DOC\\" as on insert to xm.item_document
  where new.target_type != private.get_id(\'datatype\',\'datatype_name\',\'Image\')
  do instead

insert into docass (
  docass_id,
  docass_source_id,
  docass_source_type,
  docass_target_id,
  docass_target_type,
  docass_purpose )
values (
  new.id,
  new.item,
  \'I\',
  new.target,
  private.get_datatype_source(new.target_type),
  new.purpose );

","

create or replace rule \\"_CREATE_IMG\\" as on insert to xm.item_document 
  where new.target_type = private.get_id(\'datatype\',\'datatype_name\',\'Image\')
  do instead

insert into imageass (
  imageass_id,
  imageass_source_id,
  imageass_source,
  imageass_image_id,
  imageass_purpose )
values (
  new.id,
  new.item,
  \'I\',
  new.target,
  new.purpose );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.item_document
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.item_document
  do instead nothing;

","

create or replace rule \\"_DELETE_DOC\\" as on delete to xm.item_document
  where old.target_type != private.get_id(\'datatype\',\'datatype_name\',\'Image\')
  do instead

delete from docass
where (docass_id = old.id);

","

create or replace rule \\"_DELETE_IMG\\" as on delete to xm.item_document
   where old.target_type = private.get_id(\'datatype\',\'datatype_name\',\'Image\')
  do instead

delete from imageass
where (imageass_id = old.id);

"}',

-- Conditions, Comment, System

'{}', 'Item Document Model', true);
