create or replace function xt.prj_budget_hrs(prj_id integer) returns numeric stable as $$
  select coalesce(sum(prjtask_hours_budget),0) from prjtask where prjtask_prj_id=$1;
$$ language sql;
