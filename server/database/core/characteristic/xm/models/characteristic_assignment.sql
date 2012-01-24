select private.create_model(

-- Model name, schema, table

'characteristic_assignment', '', 

-- table
'(select 
    charass_id,
    charass_target_type,
    charass_target_id,
    charass_char_id,
    charass_value,
    char_name,
    char_order
  from charass
   join char on charass_char_id=char_id) as charass',

-- Columns

E'{
  "charass.charass_id as guid",
  "charass.charass_target_type as target_type",
  "charass.charass_target_id as target",
  "charass.charass_char_id as characteristic",
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
  new.characteristic,
  new.value );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.characteristic_assignment
  do instead

update public.charass set
  charass_char_id = new.characteristic,
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
'{}', '{"charass.char_order","charass.char_name"}', 'Characteristic Assignment Model', true, true);
