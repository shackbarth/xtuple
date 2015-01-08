create or replace function xt.co_line_customer_discount(coitem) returns numeric stable as $$
  select round((case when $1.coitem_custprice = 0 then null else (1.0 - ($1.coitem_price / $1.coitem_custprice)) end),6);
$$ language sql;
