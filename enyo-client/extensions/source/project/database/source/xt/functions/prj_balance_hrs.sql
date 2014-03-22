create or replace function xt.prj_balance_hrs(prj_id integer) returns numeric stable as $$
  select xt.prj_budget_hrs($1) - xt.prj_actual_hrs($1);
$$ language sql;
