select dropIfExists('VIEW', 'currency', 'xm');

-- return rule

create or replace view xm.currency as 

select
  curr_id as id,
  curr_name as name,
  curr_symbol as symbol,
  curr_abbr as abbreviation,
  curr_base as is_base,
  rtrim(ltrim(array(
    select curr_rate_id 
    from curr_rate
    where curr_rate.curr_id = curr_symbol.curr_id)::text,'{'),'}') as rates
from public.curr_symbol;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.currency 
  do instead

insert into public.curr_symbol (
  curr_id,
  curr_name,
  curr_symbol,
  curr_abbr,
  curr_base )
values (
  new.id,
  new.name,
  new.symbol,
  new.abbreviation,
  new.is_base );

-- update rule

create or replace rule "_UPDATE" as on update to xm.currency 
  do instead

update public.curr_symbol set
  curr_name = new.name,
  curr_symbol = new.symbol,
  curr_abbr = new.abbreviation,
  curr_base = new.is_base
where ( curr_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.currency 
  do instead (

delete from curr_rate
where ( curr_id = old.id );

delete from public.curr_symbol
where ( curr_id = old.id );

)
