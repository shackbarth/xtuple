create or replace function xt.quote_line_list_price_discount(quitem) returns numeric stable as $$
  select round(case when $1.quitem_custprice = 0 then null else (1.0 - ($1.quitem_price / xt.quote_line_list_price($1))) end,6);
$$ language sql;