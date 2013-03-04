create or replace function xt.quote_margin(quhead) returns numeric stable as $$
  select xt.quote_total($1) - xt.quote_total_cost($1);
$$ language sql