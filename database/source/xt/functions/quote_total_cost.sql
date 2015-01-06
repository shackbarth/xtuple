create or replace function xt.quote_total_cost(quhead) returns numeric stable as $$
  select coalesce(sum(round((quitem_qtyord * quitem_qty_invuomratio) * currtocurr(basecurrId(), $1.quhead_curr_id, quitem_unitcost, $1.quhead_quotedate),2)),0)
  from quitem
  where (quitem_quhead_id=$1.quhead_id);
$$ language sql;