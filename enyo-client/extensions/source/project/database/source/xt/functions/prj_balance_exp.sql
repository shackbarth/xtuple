create or replace function xt.prj_balance_exp(prj_id integer) returns numeric stable as $$
  select xt.prj_budget_exp($1) - xt.prj_actual_exp($1);
$$ language sql;
