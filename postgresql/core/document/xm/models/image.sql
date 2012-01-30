select private.create_model(

-- Model name, schema, table

'image', 'public', 'image',

-- Columns

E'{
  "image.image_id as guid",
  "image.image_name as name",
  "image.image_descrip as description",
  "image.image_data as data"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.image
  do instead

insert into image (
  image_id,
  image_name,
  image_descrip,
  image_data )
values (
  new.guid,
  new.name,
  new.description,
  new.data );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.image
  do instead

update image set
  image_name = new.name,
  image_descrip = new.description,
  image_data = new.data
where ( image_id = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.image
  do instead 
  
delete from image
where ( image_id = old.guid );

"}',

-- Conditions, Comment, System

'{}', 'Image Model', true, false, 'IMG');
