select dropIfExists('VIEW', 'characteristic', 'xm');

-- return rule

create or replace view xm.characteristic as 

select
  char_id as id,
  char_name as name,
  char_type as characteristic_type,
  char_order as order,
  char_notes as notes,
  char_mask as mask,
  char_validator as validator,
  rtrim(ltrim(array(
    select charroleass_id
    from private.charroleass
    where charroleass_char_id = char_id )::text,'{'),'}') as roles,
  rtrim(ltrim(array(
    select charopt_id
    from public.charopt
    where charopt_char_id = char_id )::text,'{'),'}') as options
from public.char;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.characteristic
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

-- update rule

create or replace rule "_UPDATE" as on update to xm.characteristic
  do instead

update public.char set
  char_id = new.id,
  char_name = new.name,
  char_order = new.order,
  char_notes = new.notes,
  char_mask = new.mask,
  char_validator = new.validator
where ( char_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.characteristic
  do instead (
  
delete from public.char
where ( char_id = old.id );

);
