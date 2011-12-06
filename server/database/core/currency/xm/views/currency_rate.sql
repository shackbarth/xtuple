select dropIfExists('VIEW', 'currency_rate', 'xm');

-- return rule

create or replace view xm.currency_rate as 

select
  curr_rate_id as id,
  curr_id as currency,
  curr_rate as rate,
  curr_effective as effective,
  curr_expires as expires
from public.curr_rate;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.currency_rate 
  do instead

insert into public.curr_rate (
  curr_rate_id,
  curr_id,
  curr_rate,
  curr_effective,
  curr_expires )
values (
  new.id,
  new.currency,
  new.rate,
  new.effective,
  new.expires );

-- update rule

create or replace rule "_UPDATE" as on update to xm.currency_rate
  do instead

update public.curr_rate set
  curr_rate = new.rate,
  curr_effective = new.effective,
  curr_expires = new.expires
where ( curr_rate_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.currency_rate
  do instead (

delete from public.curr_rate
where ( curr_rate_id = old.id );

)
