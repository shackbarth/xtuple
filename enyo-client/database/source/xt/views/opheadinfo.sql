DO $$
  var dropSql = "drop view if exists xt.opheadinfo cascade;";
  var sql = "create or replace view xt.opheadinfo as  " +
   "select ophead.*, coalesce(incdtpriority_order, 99999) as priority_order, " +
   "  crmacct_number, cntct_number " +
   "from ophead " +
   "  join crmacct on crmacct_id=ophead_crmacct_id" +
   "  join cntct on cntct_id=ophead_cntct_id" +
   "  left join incdtpriority on (ophead_priority_id=incdtpriority_id); ";

  try {
    plv8.execute(sql);
  } catch (error) {
    /* let's cascade-drop the view and try again */
    plv8.execute(dropSql);
    plv8.execute(sql);
  }

$$ language plv8;

grant all on table xt.opheadinfo to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.opheadinfo
  do instead nothing;


create or replace rule "_UPDATE" as on update to xt.opheadinfo
  do instead nothing;


create or replace rule "_DELETE" as on delete to xt.opheadinfo
  do instead nothing;
  
