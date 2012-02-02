select private.create_model(

-- Model name, schema, table

'contact_characteristic', '', 'xm.characteristic_assignment',

-- Columns

E'{
  "characteristic_assignment.guid as guid",
  "characteristic_assignment.target as contact",
  "characteristic_assignment.characteristic",
  "characteristic_assignment.value"}',

-- sequence

'public.charass_charass_id_seq',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.contact_characteristic 
  do instead

insert into xm.characteristic_assignment (
  guid,
  target,
  target_type,
  characteristic,
  value )
values (
  new.guid,
  new.contact,
  \'CNTCT\',
  new.characteristic,
  new.value );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.contact_characteristic 
  do instead

update xm.characteristic_assignment set
  characteristic = new.characteristic,
  value = new.value
where ( guid = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.contact_characteristic 
  do instead

delete from xm.characteristic_assignment 
where ( guid = old.guid );

"}', 

-- Conditions, Comment, System, Nested
E'{"target_type = \'CNTCT\'"}', 'Contact Characteristic Model', true, true);
