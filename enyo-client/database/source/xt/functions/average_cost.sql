create or replace function xt.average_cost(itemsiteId Integer) returns numeric stable as $$
  select round(avgcost($1), 6);
$$ language sql