select private.create_model(

-- Model name, schema, table
'item_characteristic', 'public', 'charass',

-- Columns

E'{
  "charass.charass_id as guid",
  "charass.charass_target_id item",
  "charass.charass_char_id characteristic",
  "charass.charass_value as \\"value\\"",
  "charass.charass_default as default_value"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.item_characteristic 
  do instead

insert into charass (
  charass_id,
  charass_target_id,
  charass_target_type,
  charass_char_id,
  charass_value,
  charass_default )
values (
  new.guid,
  new.item,
  \'I\',
  new.characteristic,
  new.value,
  new.default_value );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.item_characteristic
  do instead

update charass set
  charass_char_id = new.characteristic,
  charass_value = new.value,
  charass_default = new.default_value
where ( charass_id = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.item_characteristic
  do instead 

delete from charass
where (charass_id = old.guid);

"}',

-- Conditions, Comment, System, Nested

E'{"charass_target_type = \'I\'"}', 'Item Characteristic Model', true, true);
