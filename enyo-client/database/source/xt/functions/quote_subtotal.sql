create or replace function xt.quote_subtotal(integer) returns numeric stable as $$
  select coalesce(sum(round((quitem_qtyord * quitem_qty_invuomratio) * (quitem_price / quitem_price_invuomratio),2)),0)
  from quitem
  where (quitem_quhead_id=$1);
$$ language sql