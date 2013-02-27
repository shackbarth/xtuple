create or replace function xt.quote_line_extended_price(integer) returns numeric stable as $$
  select round((quitem_qtyord * quitem_qty_invuomratio) * (quitem_price / quitem_price_invuomratio),2)
  from quitem
  where (quitem_id=$1);
$$ language sql