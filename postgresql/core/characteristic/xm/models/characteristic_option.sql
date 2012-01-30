select private.create_model(

-- Model name, schema, table

'characteristic_option', 'public', 'charopt',

-- Columns

E'{
  "charopt.charopt_id as guid",
  "charopt.charopt_char_id as characteristic",
  "charopt.charopt_value as value",
  "charopt.charopt_order as order"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.characteristic_option
  do instead

insert into public.charopt (
  charopt_id,
  charopt_char_id,
  charopt_value,
  charopt_order )
values (
  new.guid,
  new.characteristic,
  new.value,
  new.order
);

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.characteristic_option
  do instead

update public.charopt set
  charopt_id = new.guid,
  charopt_char_id = new.characteristic,
  charopt_value = new.value,
  charopt_order = new.order
where ( charopt_id = old.guid );

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.characteristic_option
  do instead 

delete from public.charopt
where ( charopt_id = old.guid );

"}', 

-- Conditions, Comment, System

'{}', 'Characteristic Option Model', true, true);

