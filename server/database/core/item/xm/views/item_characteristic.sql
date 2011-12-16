select dropIfExists('VIEW', 'item_characteristic', 'xm');

-- return rule

create or replace view xm.item_characteristic as

select  
  charass_id as id,
  charass_target_id item,
  charass_char_id characteristic,
  charass_value as "value",
  charass_default as default_value
from charass
where ( charass_target_type = 'I' );

-- insert rule

create or replace rule "_CREATE" as on insert to xm.item_characteristic 
  do instead

insert into charass (
  charass_id,
  charass_target_id,
  charass_target_type,
  charass_char_id,
  charass_value,
  charass_default )
values (
  new.id,
  new.item,
  'I',
  new.characteristic,
  new.value,
  new.default_value );

-- update rule

create or replace rule "_UPDATE" as on update to xm.item_characteristic
  do instead

update charass set
  charass_char_id = new.characteristic,
  charass_value = new.value,
  charass_default = new.default_value
where ( charass_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.item_characteristic
  do instead 

delete from charass
where (charass_id = old.id);
