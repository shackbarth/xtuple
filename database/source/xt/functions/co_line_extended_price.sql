create or replace function xt.co_line_extended_price(coitem) returns numeric stable as $$
  select round(($1.coitem_qtyord * $1.coitem_qty_invuomratio) * ($1.coitem_price / $1.coitem_price_invuomratio),2);
$$ language sql;
