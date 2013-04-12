create or replace function xt.so_line_customer_discount(soitem) returns numeric stable as $$
  select round((case when $1.soitem_custprice = 0 then null else (1.0 - ($1.soitem_price / $1.soitem_custprice)) end),6);
$$ language sql
