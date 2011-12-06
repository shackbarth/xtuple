select dropIfExists('VIEW', 'unit_conversion', 'xm');

-- return rule

create or replace view xm.unit_conversion as 

select
  uomconv_id as id,
  uomconv_from_uom_id as from_unit,
  uomconv_from_value as from_value,
  uomconv_to_uom_id as to_unit,
  uomconv_to_value as to_value
from public.uomconv;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.unit_conversion
  do instead

insert into public.uomconv (
  uomconv_id,
  uomconv_from_uom_id,
  uomconv_from_value,
  uomconv_to_uom_id,
  uomconv_to_value )
values (
  new.id,
  new.from_unit,
  new.from_value,
  new.to_unit,
  new.to_value );

-- update rule

create or replace rule "_UPDATE" as on update to xm.unit_conversion
  do instead

update public.uomconv set
  uomconv_from_uom_id = new.from_unit,
  uomconv_from_value = new.from_value,
  uomconv_to_uom_id = new.to_unit,
  uomconv_to_value = new.to_value
where ( uomconv_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.unit_conversion
  do instead (

delete from public.uomconv
where ( uomconv_id = old.id );

)
