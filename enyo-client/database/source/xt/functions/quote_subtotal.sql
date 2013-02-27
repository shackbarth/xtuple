create or replace function xt.quote_subtotal(integer) returns numeric stable as $$
  select coalesce(sum(xt.quote_line_extended_price(quitem_id)),0)
  from quitem
  where (quitem_quhead_id=$1);
$$ language sql