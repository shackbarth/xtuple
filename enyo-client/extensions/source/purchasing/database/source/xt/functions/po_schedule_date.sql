create or replace function xt.po_schedule_date(pohead) returns date stable as $$
  select poitem_duedate
  from poitem
  where poitem_pohead_id=$1.pohead_id
    and poitem_status in ('U','O')
    and poitem_qty_ordered - poitem_qty_received + poitem_qty_returned > 0
  order by poitem_duedate
  limit 1;
$$ language sql;