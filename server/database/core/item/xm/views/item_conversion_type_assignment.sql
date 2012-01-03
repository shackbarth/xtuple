select private.create_model(

-- Model name, schema, table
'item_conversion_type_assignment', 'public', 'itemuom',

-- Columns

E'{
  itemuom_id as id,
  itemuom_itemuomconv_id as item_conversion,
  itemuom_uomtype_id as unit_type
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.item_conversion_type_assignment
  do instead

insert into itemuom (
  itemuom_id,
  itemuom_itemuomconv_id,
  itemuom_uomtype_id )
values (
  new.id,
  new.item_conversion,
  new.unit_type );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.item_conversion_type_assignment
  do instead nothing;

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.item_conversion_type_assignment
  do instead

delete from itemuom
where ( itemuom_id = old.id );

"}',

-- Conditions, Comment, System

'{}', 'Item Conversion Type Assignment Model', true);
