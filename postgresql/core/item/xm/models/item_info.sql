select private.create_model(

-- Model name, schema, table

'item_info', '', 'item',

-- Columns

E'{
  "item.item_id  as guid",
  "item.item_number  as number",
  "item.item_active  as is_active",
  "item.item_descrip1 as description1",
  "item.item_descrip2 as description2",
  "item.item_inv_uom_id as inventory_unit"}',

-- sequence

'',

-- Rules

E'{"
-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.item_info 
  do instead nothing;

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.item_info
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.item_info   
  do instead nothing;

"}', 

-- Conditions, Comment, System, Nested

E'{"checkPrivilege(\'ViewItemMasters\')"}', 'Item Info Model', true, true);
