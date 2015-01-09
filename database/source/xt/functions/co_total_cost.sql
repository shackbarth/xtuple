create or replace function xt.co_total_cost(cohead) returns numeric stable as $$
  select coalesce(sum(round((coitem_qtyord * coitem_qty_invuomratio) * currtocurr(basecurrId(), $1.cohead_curr_id, coitem_unitcost, $1.cohead_orderdate),2)),0)
  from coitem
  where (coitem_cohead_id=$1.cohead_id);
$$ language sql;
