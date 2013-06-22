create or replace function xt.co_schedule_date(cohead) returns date stable as $$
  select min(coitem_scheddate) from coitem where coitem_cohead_id=$1.cohead_id;
$$ language sql;
