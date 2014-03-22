create or replace function xt.prj_actual_hrs(prj_id integer) returns numeric stable as $$
  select coalesce(sum(prjtask_hours_actual),0) from prjtask where prjtask_prj_id=$1;
$$ language sql;
