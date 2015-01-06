create or replace function xt.invc_line_extended_price(quantity numeric, quantity_ratio numeric, price numeric, price_ratio numeric) 
    returns numeric stable as $$
  select round(($1 * $2) * ($3 / $4),2);
$$ language sql;
