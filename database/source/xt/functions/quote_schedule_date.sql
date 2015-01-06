create or replace function xt.quote_schedule_date(quhead) returns date stable as $$
  select min(quitem_scheddate) from quitem where quitem_quhead_id=$1.quhead_id;
$$ language sql;