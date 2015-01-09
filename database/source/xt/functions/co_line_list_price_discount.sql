create or replace function xt.co_line_list_price_discount(coitem) returns numeric stable as $$
  select round(case when $1.coitem_custprice = 0 or xt.co_line_list_price($1) = 0 then null else (1.0 - ($1.coitem_price / xt.co_line_list_price($1))) end,6);
$$ language sql;
