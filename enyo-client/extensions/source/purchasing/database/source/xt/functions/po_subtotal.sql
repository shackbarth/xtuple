create or replace function xt.po_subtotal(pohead) returns numeric stable as $$
  select coalesce(sum(poitem_qty_ordered * poitem_unitprice),0)
  from poitem
  where (poitem_pohead_id=$1.pohead_id);
$$ language sql;
