create or replace function xt.po_freight_subtotal(pohead) returns numeric stable as $$
  select round(coalesce(sum(poitem_freight), 0), 2)
  from poitem
  where poitem_pohead_id=$1.pohead_id;
$$ language sql;
