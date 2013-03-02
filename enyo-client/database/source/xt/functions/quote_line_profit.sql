create or replace function xt.quote_line_profit(quitem) returns numeric stable as $$
  select round(case when $1.quitem_unitcost = 0 then 1 else ($1.quitem_custprice - $1.quitem_unitcost) / $1.quitem_unitcost end,6);
$$ language sql