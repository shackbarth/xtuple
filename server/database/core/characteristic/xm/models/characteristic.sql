select private.create_model(

-- Model name, schema, table

'characteristic', 'public', 'char',

-- Columns

E'{
  "char.char_id as id",
  "char.char_name as name",
  "char.char_type as characteristic_type",
  "char.char_order as order",
  "char.char_notes as notes",
  "char.char_mask as mask",
  "char.char_validator as validator",
  "btrim(array(
    select charopt_id
    from public.charopt
    where charopt_char_id = char.char_id )::text,\'{}\') as options",
  "char.char_addresses as is_addresses",
  "char.char_contacts as is_contacts",
  "char.char_items as is_items"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.characteristic
  do instead

insert into public.char (
  char_id,
  char_name,
  char_type,
  char_order,
  char_notes,
  char_mask,
  char_validator,
  char_addresses,
  char_crmaccounts,
  char_contacts,
  char_customers,
  char_items,
  char_incidents,
  char_lotserial,
  char_opportunity,
  char_search,
  char_options,
  char_attributes )
values (
  new.id,
  new.name,
  new.characteristic_type,
  new.order,
  new.notes,
  new.mask,
  new.validator,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  false );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.characteristic
  do instead

update public.char set
  char_id = new.id,
  char_name = new.name,
  char_order = new.order,
  char_notes = new.notes,
  char_mask = new.mask,
  char_validator = new.validator
where ( char_id = old.id );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.characteristic
  do instead (
  
delete from public.char
where ( char_id = old.id );

);

"}', 

-- Conditions, Comment, System

'{}', 'Characteristic Model', true);

