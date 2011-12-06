select dropIfExists('VIEW', 'characteristic_option', 'xm');

-- return rule

create or replace view xm.characteristic_option as 

select
  charopt_id as id,
  charopt_char_id as characteristic,
  charopt_value as value,
  charopt_order as order
from public.charopt;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.characteristic_option
  do instead

insert into public.charopt (
  charopt_id,
  charopt_char_id,
  charopt_value,
  charopt_order )
values (
  new.id,
  new.characteristic,
  new.value,
  new.order
);

-- update rule

create or replace rule "_UPDATE" as on update to xm.characteristic_option
  do instead

update public.charopt set
  charopt_id = new.id,
  charopt_char_id = new.characteristic,
  charopt_value = new.value,
  charopt_order = new.order
where ( charopt_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.characteristic_option
  do instead 

delete from public.charopt
where ( charopt_id = old.id );
