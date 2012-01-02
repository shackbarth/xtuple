select private.create_model(

-- Model name, schema, table

'item', 'public', 'item',

-- Columns

E'{
  "item.item_id  as id",
  "item.item_number  as \\"number\\"",
  "item.item_active  as is_active",
  "item.item_descrip1 as description1",
  "item.item_descrip2 as description2",
  "item.item_classcode_id as class_code",
  "item.item_inv_uom_id as inventory_unit",
  "item.item_picklist as is_picklist",
  "item.item_comments as notes",
  "item.item_sold as is_sold",
  "item.item_fractional as is_fractional",
  "item.item_type as \\"type\\"",
  "item.item_prodweight as product_weight",
  "item.item_packweight as package_weight",
  "item.item_prodcat_id as product_category",
  "item.item_exclusive as is_exclusive",
  "item.item_listprice as list_price",
  "item.item_price_uom_id as price_unit",
  "item.item_config as is_configured",
  "item.item_extdescrip as extended_description",
  "item.item_upccode as barcode",
  "item.item_warrdays as warranty_days",
  "item.item_freightclass_id as freight_class",
  "item.item_maxcost as max_cost",
  "btrim(array(
   select comment_id
   from \\"comment\\"
   where comment_source_id = item.item_id
    and comment_source = \'I\')::text,\'{}\') as \\"comments\\"",
  "btrim(array(
   select charass_id 
   from charass
   where charass_target_id = item.item_id
    and charass_target_type = \'I\')::text,\'{}\') as \\"characteristics\\"",
  "btrim(array(
   select itemuomconv_id
   from itemuomconv
   where itemuomconv_item_id = item.item_id)::text,\'{}\') as conversions",
  "btrim(array(
   select itemalias_id
   from itemalias
   where itemalias_item_id = item.item_id)::text,\'{}\') as aliases",
  "btrim(array(
   select itemsub_id 
   from itemsub
   where itemsub_parent_item_id = item.item_id)::text,\'{}\') as substitutes",
  "btrim(array(
   select docass_id 
   from docass
   where docass_target_id = item.item_id 
    and docass_target_type = \'I\'
   union all
   select docass_id 
   from docass
   where docass_source_id = item.item_id 
    and docass_source_type = \'I\'
   union all
   select imageass_id 
   from imageass
   where imageass_source_id = item.item_id 
    and imageass_source = \'I\')::text,\'{}\') as documents"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.item
  do instead

insert into item (
  item_id,
  item_number,
  item_active,
  item_descrip1,
  item_descrip2,
  item_classcode_id,
  item_inv_uom_id,
  item_picklist,
  item_comments,
  item_sold,
  item_fractional,
  item_type,
  item_prodweight,
  item_packweight,
  item_prodcat_id,
  item_exclusive,
  item_listprice,
  item_price_uom_id,
  item_config,
  item_extdescrip,
  item_upccode,
  item_warrdays,
  item_freightclass_id,
  item_maxcost )
values (
  new.id,
  new.number,
  new.is_active,
  new.description1,
  new.description2,
  new.class_code,
  new.inventory_unit,
  new.is_picklist,
  new.notes,
  new.is_sold,
  new.is_fractional,
  new.type,
  new.product_weight,
  new.package_weight,
  new.product_category,
  new.is_exclusive,
  new.list_price,
  new.price_unit,
  new.is_configured,
  new.extended_description,
  new.barcode,
  new.warranty_days,
  new.freight_class,
  new.max_cost );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.item
  do instead

update item set
  item_active = new.is_active,
  item_descrip1 = new.description1,
  item_descrip2 = new.description2,
  item_classcode_id = new.class_code,
  item_inv_uom_id = new.inventory_unit,
  item_picklist = new.is_picklist,
  item_comments = new.notes,
  item_sold = new.is_sold,
  item_fractional = new.is_fractional,
  item_type = new.type,
  item_prodweight = new.product_weight,
  item_packweight = new.package_weight,
  item_prodcat_id = new.product_category,
  item_exclusive = new.is_exclusive,
  item_listprice = new.list_price,
  item_price_uom_id = new.price_unit,
  item_config = new.is_configured,
  item_extdescrip = new.extended_description,
  item_upccode = new.barcode,
  item_warrdays = new.warranty_days,
  item_freightclass_id = new.freight_class,
  item_maxcost = new.max_cost
where ( item_id = old.id );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.item
  do instead (

delete from comment
where (comment_source_id = old.id
  and comment_source = \'I\');

delete from charass
where (charass_target_id = old.id
  and charass_target_type = \'I\');

delete from itemuom
USING itemuomconv
where (itemuom_itemuomconv_id = itemuomconv_id
  and itemuomconv_item_id = old.id);

delete from itemuomconv
where (itemuomconv_item_id = old.id);

delete from itemalias
where (itemalias_item_id = old.id);

delete from itemsub
where (itemsub_parent_item_id = old.id);

delete from docass
where (docass_target_id = old.id
  and docass_target_type = \'I\')
  or
    (docass_source_id = old.id
  and docass_source_type = \'I\');

delete from imageass
where ( imageass_source_id = old.id
  and imageass_source = \'I\' );

delete from item
 where (item_id = old.id);

)

"}',

-- Conditions, Comment, System

'{}', 'Item Model', true);
