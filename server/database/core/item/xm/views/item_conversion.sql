select dropIfExists('VIEW', 'item_conversion', 'xm');

-- return rule

create or replace view xm.item_conversion as

select  
  itemuomconv_id as id,
  itemuomconv_item_id as item,
  itemuomconv_from_uom_id as from_unit,
  itemuomconv_from_value as from_value,
  itemuomconv_to_uom_id as to_unit,
  itemuomconv_to_value as to_value,
  itemuomconv_fractional as fractional
from itemuomconv;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.item_conversion
  do instead

insert into itemuomconv (
  itemuomconv_id,
  itemuomconv_item_id,
  itemuomconv_from_uom_id,
  itemuomconv_from_value,
  itemuomconv_to_uom_id,
  itemuomconv_to_value,
  itemuomconv_fractional )
values (
  new.id,
  new.item,
  new.from_unit,
  new.from_value,
  new.to_unit,
  new.to_value,
  new.fractional );

-- update rule

create or replace rule "_UPDATE" as on update to xm.item_conversion
  do instead

update itemuomconv set
  itemuomconv_from_value = new.from_value,
  itemuomconv_to_value = new.to_value,
  itemuomconv_fractional = new.fractional
where ( itemuomconv_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.item_conversion
  do instead 

delete from itemuomconv
where ( itemuomconv_id = old.id );