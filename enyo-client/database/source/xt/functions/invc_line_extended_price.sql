create or replace function xt.invc_line_extended_price(invcitem) returns numeric stable as $$
  select round(($1.invcitem_ordered * $1.invcitem_qty_invuomratio) * ($1.invcitem_price / $1.invcitem_price_invuomratio),2);
$$ language sql;
