create or replace function xt.quote_line_extended_price(quitem) returns numeric stable as $$
  select round(($1.quitem_qtyord * $1.quitem_qty_invuomratio) * ($1.quitem_price / $1.quitem_price_invuomratio),2);
$$ language sql;