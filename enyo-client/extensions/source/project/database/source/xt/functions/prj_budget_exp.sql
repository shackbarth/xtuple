create or replace function xt.prj_budget_exp(prj_id integer) returns numeric stable as $$
  select coalesce(sum(prjtask_exp_budget),0) from prjtask where prjtask_prj_id=$1;
$$ language sql;
