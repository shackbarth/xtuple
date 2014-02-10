create or replace function xt.co_line_ship_balance(coitem) returns numeric stable as $$
  select case when $1.coitem_status = 'O' then
    round($1.coitem_qtyord - $1.coitem_qtyshipped + $1.coitem_qtyreturned,6)
  else 0 end;
$$ language sql;
