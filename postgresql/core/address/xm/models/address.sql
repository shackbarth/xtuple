select private.create_model(

-- Model name, schema, table

'address', 'public', 'addr',

-- Columns

E'{
  "addr.addr_id as guid",
  "addr.addr_number as number",
  "addr.addr_active as is_active",
  "addr.addr_line1 as line1",
  "addr.addr_line2 as line2",
  "addr.addr_line3 as line3",
  "addr.addr_city as city",
  "addr.addr_state as state",
  "addr.addr_postalcode as postalcode",
  "addr.addr_country as country",
  "addr.addr_notes as notes",
  "array(
    select address_comment 
    from xm.address_comment
    where address = addr.addr_id) as comments",
  "array(
    select address_characteristic 
    from xm.address_characteristic
    where address = addr.addr_id) as characteristics"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.address 
  do instead

insert into public.addr (
  addr_id,
  addr_number,
  addr_active,
  addr_line1,
  addr_line2,
  addr_line3,
  addr_city,
  addr_state,
  addr_postalcode,
  addr_country )
values (
  new.guid,
  new.number,
  new.is_active,
  new.line1,
  new.line2,
  new.line3,
  new.city,
  new.state,
  new.postalcode,
  new.country );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.address 
  do instead

update public.addr set
  addr_number = new.number,
  addr_active = new.is_active,
  addr_line1 = new.line1,
  addr_line2 = new.line2,
  addr_line3 = new.line3,
  addr_city = new.city,
  addr_state = new.state,
  addr_postalcode = new.postalcode,
  addr_country = new.country
where ( addr_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.address 
  do instead (

delete from comment 
where ( comment_source_id = old.guid ) 
 and ( comment_source = \'ADDR\' );

delete from charass
where ( charass_target_id = old.guid ) 
 and ( charass_target_type = \'ADDR\' );

delete from public.addr 
where ( addr_id = old.guid );

)

"}', 

-- Conditions, Comment, System

'{}', 'Address Model', true, false, 'ADDR');
