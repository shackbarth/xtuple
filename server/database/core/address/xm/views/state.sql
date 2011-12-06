select dropIfExists('VIEW', 'state', 'xm');

-- return rule

create or replace view xm.state as 

select
  state_id as id,
  state_name as name,
  state_abbr as abbreviation,
  state_country_id as country
from public.state;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.state
  do instead

insert into public.state (
  state_id,
  state_name,
  state_abbr,
  state_country_id )
values (
  new.id,
  new.name,
  new.abbreviation,
  new.country );

-- update rule

create or replace rule "_UPDATE" as on update to xm.state
  do instead

update public.state set
  state_name = new.name,
  state_abbr = new.abbreviation,
  state_country_id = new.country
where ( state_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.state
  do instead 
  
delete from public.state
where ( state_id = old.id );
