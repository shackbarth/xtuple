select dropIfExists('VIEW', 'characteristic_role_assignment', 'xm');

-- return rule

create or replace view xm.characteristic_role_assignment as 

select
  charroleass_id as id,
  charroleass_char_id as characteristic,
  charroleass_charrole_id as characteristic_role
from private.charroleass;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.characteristic_role_assignment
  do instead

insert into private.charroleass (
  charroleass_id,
  charroleass_char_id,
  charroleass_charrole_id )
values (
  new.id,
  new.characteristic,
  new.characteristic_role
);

-- update rule

create or replace rule "_UPDATE" as on update to xm.characteristic_role_assignment
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xm.characteristic_role_assignment
  do instead 

delete from private.charroleass
where ( charroleass_id = old.id );
