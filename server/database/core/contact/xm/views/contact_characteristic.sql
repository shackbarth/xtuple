select dropIfExists('VIEW', 'contact_characteristic', 'xm');

-- select rule

create or replace view xm.contact_characteristic as 

select
  charass_id as id,
  charass_target_id as contact,
  charass_char_id as characteristic,
  charass_value as value
from public.charass
where ( charass_target_type = 'CNTCT' );

-- insert rule

create or replace rule "_CREATE" as on insert to xm.contact_characteristic 
  do instead

insert into public.charass (
  charass_id,
  charass_target_id,
  charass_target_type,
  charass_char_id,
  charass_value )
values (
  new.id,
  new.contact,
  'CNTCT',
  new.characteristic,
  new.value );

-- update rule

create or replace rule "_UPDATE" as on update to xm.contact_characteristic 
  do instead

update public.charass set
  charass_char_id = new.characteristic,
  charass_value = new.value
where ( charass_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.contact_characteristic 
  do instead

delete from public.charass 
where ( charass_id = old.id );
