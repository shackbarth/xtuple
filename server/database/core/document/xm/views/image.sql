select dropIfExists('VIEW', 'image', 'xm');

-- return rule

create or replace view xm.image as 

select
  image_id as id,
  image_name as name,
  image_descrip as description,
  image_data as data
from image;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.image
  do instead

insert into image (
  image_id,
  image_name,
  image_descrip,
  image_data )
values (
  new.id,
  new.name,
  new.description,
  new.data );

-- update rule

create or replace rule "_UPDATE" as on update to xm.image
  do instead

update image set
  image_name = new.name,
  image_descrip = new.description,
  image_data = new.data
where ( image_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.image
  do instead 
  
delete from image
where ( image_id = old.id );
