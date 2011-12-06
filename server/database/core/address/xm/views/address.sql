select dropIfExists('VIEW', 'address', 'xm');

-- return rule

create or replace view xm.address as 

select
  addr_id as id,
  addr_number as number,
  addr_active as is_active,
  addr_line1 as line1,
  addr_line2 as line2,
  addr_line3 as line3,
  addr_city as city,
  addr_state as state,
  addr_postalcode as postalcode,
  addr_country as country,
  rtrim(ltrim(array(
    select comment_id 
    from comment
    where comment_source_id = addr_id 
      and comment_source = 'ADDR')::text,'{'),'}') as comments,
  rtrim(ltrim(array(
    select charass_id 
    from charass
    where charass_target_id = addr_id 
      and charass_target_type = 'ADDR')::text,'{'),'}') as characteristics
from public.addr;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.address 
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
  new.id,
  new.number,
  new.is_active,
  new.line1,
  new.line2,
  new.line3,
  new.city,
  new.state,
  new.postalcode,
  new.country );

-- update rule

create or replace rule "_UPDATE" as on update to xm.address 
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
where ( addr_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.address 
  do instead (

delete from comment 
where ( comment_source_id = old.id ) 
 and ( comment_source = 'ADDR' );

delete from charass
where ( charass_target_id = old.id ) 
 and ( charass_target_type = 'ADDR' );

delete from public.addr 
where ( addr_id = old.id );

)
