create or replace function xt.quote_subtotal(quhead) returns numeric stable as $$
  select coalesce(sum(xt.quote_line_extended_price(quitem)),0)
  from quitem
  where (quitem_quhead_id=$1.quhead_id);
$$ language sql;