DO $$
  var dropSql = "drop view if exists xt.prjinfo cascade;";
  var sql = "create or replace view xt.prjinfo as " +
   "select " +
   "prj_id, prj_number, prj_name, prj_status, prj_start_date, prj_assigned_date, prj_due_date, prj_completed_date, " +
   "prj_username, prj_owner_username, prj_crmacct_id, prj_cntct_id, " +
   "coalesce(sum(prjtask_hours_budget),0) as prj_hours_budget, " +
   "coalesce(sum(prjtask_hours_actual),0) as prj_hours_actual, " +
   "coalesce(sum(prjtask_hours_budget),0) - coalesce(sum(prjtask_hours_actual),0) as prj_hours_balance, " +
   "coalesce(sum(prjtask_exp_budget),0) as prj_exp_budget, " +
   "coalesce(sum(prjtask_exp_actual),0) as prj_exp_actual, " +
   "coalesce(sum(prjtask_exp_budget),0) - coalesce(sum(prjtask_exp_actual),0) as prj_exp_balance, " +
   "crmacct_number, cntct_number " +
   "from prj " +
   "  left join prjtask on prjtask_prj_id=prj_id " +
   "  left join crmacct on prj_crmacct_id=crmacct_id " + 
   "  left join cntct on prj_cntct_id=cntct_id " +
   "group by prj_id, prj_number, prj_name, prj_status, prj_start_date, prj_assigned_date, prj_due_date, prj_completed_date, " +
   "prj_username, prj_owner_username, prj_crmacct_id, crmacct_number, cntct_number;";

  try {
    plv8.execute(sql);
  } catch (error) {
    /* let's cascade-drop the view and try again */
    plv8.execute(dropSql);
    plv8.execute(sql);
  }

$$ language plv8;

grant all on table xt.prjinfo to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.prjinfo
  do instead nothing;


create or replace rule "_UPDATE" as on update to xt.prjinfo
  do instead nothing;


create or replace rule "_DELETE" as on delete to xt.prjinfo
  do instead nothing;
