create or replace function xt.quote_total_cost(quhead) returns numeric stable as $$
  select coalesce(sum(quitem_unitcost),0)
  from quitem
  where (quitem_quhead_id=$1.quhead_id);
$$ language sql