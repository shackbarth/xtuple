select private.create_model(

-- Model name, schema, table

'unit', 'public', 'uom',

-- Columns

E'{
  "uom.uom_id as guid",
  "uom.uom_name as name",
  "uom.uom_descrip as description",
  "uom.uom_item_weight as is_item_weight",
  "array(
    select unit_conversion
    from xm.unit_conversion
    where from_unit = uomconv_from_uom_id
    union all
    select unit_conversion
    from xm.unit_conversion
    where to_unit = uomconv_to_uom_id) as conversions"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.unit 
  do instead

insert into public.uom (
  uom_id,
  uom_name,
  uom_descrip,
  uom_item_weight )
values (
  new.guid,
  new.name,
  new.description,
  new.is_item_weight);

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.unit
  do instead

update public.uom set
  uom_name = new.name,
  uom_descrip = new.description,
  uom_item_weight = new.is_item_weight
where ( uom_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.unit
  do instead (

delete from public.uomconv
where ( uomconv_from_uom_id = old.guid );

delete from public.uomconv
where ( uomconv_to_uom_id = old.guid );

delete from public.uom
where ( uom_id = old.guid );

)

"}',

-- Conditions, Comment, System

'{}', 'Unit Model', true);
