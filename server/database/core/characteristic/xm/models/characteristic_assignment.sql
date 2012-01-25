select private.create_model(

-- Model name, schema, table

'characteristic_assignment', '', 'xm.characteristic join charass on guid = charass_char_id', 

-- Columns

E'{
  "charass.charass_id as guid",
  "charass.charass_target_type as target_type",
  "charass.charass_target_id as target",
  "characteristic",
  "charass.charass_value as value"}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.characteristic_assignment 
  do instead

insert into public.charass (
  charass_id,
  charass_target_id,
  charass_target_type,
  charass_char_id,
  charass_value )
values (
  new.guid,
  new.target,
  new.target_type,
  (new.characteristic).guid,
  new.value );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.characteristic_assignment
  do instead

update public.charass set
  charass_char_id = (new.characteristic).guid,
  charass_value = new.value
where ( charass_id = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.characteristic_assignment 
  do instead

delete from public.charass 
where ( charass_id = old.guid );

"}', 

-- Conditions, Order, Comment, System, Nested
'{}', '{"characteristic.order","characteristic.name"}', 'Characteristic Assignment Model', true, true);
