create or replace function xt.co_line_ship_balance(coitem) returns numeric stable as $$
  select round($1.coitem_qtyord - $1.coitem_qtyshipped + $1.coitem_qtyreturned,6);
$$ language sql;
