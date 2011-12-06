select dropIfExists('VIEW', 'unit', 'xm');

-- return rule

create or replace view xm.unit as 

select
  uom_id as id,
  uom_name as name,
  uom_descrip as description,
  uom_item_weight as is_item_weight,
  rtrim(ltrim(array(
    select uomconv_id
    from uomconv
    where uom_id = uomconv_from_uom_id
    union all
    select uomconv_id
    from uomconv
    where uom_id = uomconv_to_uom_id
    )::text,'{'),'}') as conversions
from public.uom;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.unit 
  do instead

insert into public.uom (
  uom_id,
  uom_name,
  uom_descrip,
  uom_item_weight )
values (
  new.id,
  new.name,
  new.description,
  new.is_item_weight );

-- update rule

create or replace rule "_UPDATE" as on update to xm.unit
  do instead

update public.uom set
  uom_name = new.name,
  uom_descrip = new.description,
  uom_item_weight = new.is_item_weight
where ( uom_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.unit
  do instead (

delete from public.uomconv
where ( uomconv_from_uom_id = old.id );

delete from public.uomconv
where ( uomconv_to_uom_id = old.id );

delete from public.uom
where ( uom_id = old.id );

)
