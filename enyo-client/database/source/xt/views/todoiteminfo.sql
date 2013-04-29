DO $$
  var dropSql = "drop view if exists xt.todoiteminfo cascade;";
  var sql = "create or replace view xt.todoiteminfo as  " +
   "select todoitem.*, coalesce(incdtpriority_order, 99999) as priority_order, " +
   "  crmacct_number, cntct_number " +
   "from todoitem " +
   "  left join incdtpriority on todoitem_priority_id=incdtpriority_id " +
   "  left join crmacct on crmacct_id = todoitem_crmacct_id " +
   "  left join cntct on cntct_id = todoitem_cntct_id;";

  try {
    plv8.execute(sql);
  } catch (error) {
    /* let's cascade-drop the view and try again */
    plv8.execute(dropSql);
    plv8.execute(sql);
  }

$$ language plv8;

grant all on table xt.todoiteminfo to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.todoiteminfo
  do instead nothing;


create or replace rule "_UPDATE" as on update to xt.todoiteminfo
  do instead nothing;


create or replace rule "_DELETE" as on delete to xt.todoiteminfo
  do instead nothing;
  
