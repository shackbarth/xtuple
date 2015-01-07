create or replace function xt.co_schedule_date(cohead) returns date stable as $$
  select coitem_scheddate
  from coitem
  where coitem_cohead_id=$1.cohead_id
    and coitem_status='O'
    and coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned > 0
  order by coitem_scheddate
  limit 1;
$$ language sql;