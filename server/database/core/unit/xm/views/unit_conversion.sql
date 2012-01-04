select private.create_model(

-- Model name, schema, table

'unit_conversion', 'public', 'uomconv',

-- Columns

E'{
  "uomconv.uomconv_id as guid",
  "uomconv.uomconv_from_uom_id as from_unit",
  "uomconv.uomconv_from_value as from_value",
  "uomconv.uomconv_to_uom_id as to_unit",
  "uomconv.uomconv_to_value as to_value"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.unit_conversion
  do instead

insert into public.uomconv (
  uomconv_id,
  uomconv_from_uom_id,
  uomconv_from_value,
  uomconv_to_uom_id,
  uomconv_to_value )
values (
  new.guid,
  new.from_unit,
  new.from_value,
  new.to_unit,
  new.to_value );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.unit_conversion
  do instead

update public.uomconv set
  uomconv_from_uom_id = new.from_unit,
  uomconv_from_value = new.from_value,
  uomconv_to_uom_id = new.to_unit,
  uomconv_to_value = new.to_value
where ( uomconv_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.unit_conversion
  do instead (

delete from public.uomconv
where ( uomconv_id = old.guid );

)

"}',

-- Conditions, Comment, System

'{}', 'Unit Conversion Model', true);
