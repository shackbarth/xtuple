create or replace function xt.co_margin(cohead) returns numeric stable as $$
  select round(xt.co_subtotal($1) - xt.co_total_cost($1),2);
$$ language sql;
