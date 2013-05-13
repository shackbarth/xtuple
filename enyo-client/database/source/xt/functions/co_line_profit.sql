create or replace function xt.co_line_profit(coitem) returns numeric stable as $$
  select round(case when $1.coitem_unitcost = 0 then 1 else ($1.coitem_price - $1.coitem_unitcost) / $1.coitem_unitcost end,6);
$$ language sql
