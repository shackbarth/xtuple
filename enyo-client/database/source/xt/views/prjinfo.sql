DO $$
  var dropSql = "drop view if exists xt.prjinfo cascade;";
  var sql = "create or replace view xt.prjinfo as " +
   "select 123, " +
   "prj_id, prj_number, prj_name, prj_status, prj_start_date, prj_assigned_date, prj_due_date, prj_completed_date, " +
   "prj_username, prj_owner_username, prj_crmacct_id, prj_cntct_id, " +
   "coalesce(sum(prjtask_hours_budget),0) as prj_hours_budget, " +
   "coalesce(sum(prjtask_hours_actual),0) as prj_hours_actual, " +
   "coalesce(sum(prjtask_hours_budget),0) - coalesce(sum(prjtask_hours_actual),0) as prj_hours_balance, " +
   "coalesce(sum(prjtask_exp_budget),0) as prj_exp_budget, " +
   "coalesce(sum(prjtask_exp_actual),0) as prj_exp_actual, " +
   "coalesce(sum(prjtask_exp_budget),0) - coalesce(sum(prjtask_exp_actual),0) as prj_exp_balance " +
   "from prj " +
   "left join prjtask on prjtask_prj_id=prj_id " +
   "group by prj_id, prj_number, prj_name, prj_status, prj_start_date, prj_assigned_date, prj_due_date, prj_completed_date, " +
   "prj_username, prj_owner_username, prj_crmacct_id;";

  try {
    plv8.execute(sql);
  } catch (error) {
    /* TODO: this will never really error out until we stop wiping out all the views at the top of init_instance */
    plv8.elog(NOTICE, "error is", error);

    var dependencies = XT.Orm.viewDependencies("xt.prjinfo");
    /* TODO: why is this empty!?! */
    plv8.elog(NOTICE, JSON.stringify(dependencies));

    /* TODO: delete these dependencies dynamically */
    plv8.execute("drop view if exists xm.project_list_item");
    plv8.execute("delete from xt.orm where orm_type LIKE 'ProjectListItem'");
    
    /* TODO: uncomment this to drop and rebuild */
    plv8.execute(dropSql);
    plv8.execute(sql);
  }
  /* TODO: do the same for every view */

$$ language plv8;

grant all on table xt.prjinfo to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.prjinfo
  do instead nothing;


create or replace rule "_UPDATE" as on update to xt.prjinfo
  do instead nothing;


create or replace rule "_DELETE" as on delete to xt.prjinfo
  do instead nothing;
