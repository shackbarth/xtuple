DO $$
  var dropSql = "drop view if exists xt.cntctinfo cascade;";
  var sql = "create or replace view xt.cntctinfo as " +
   "select cntct.*, a.crmacct_number, p.crmacct_number as crmacct_parent_number " +
   "from cntct " +
   "  left join crmacct a on a.crmacct_id=cntct_crmacct_id " +
   "  left join crmacct p on a.crmacct_parent_id=p.crmacct_id;";

  try {
    plv8.execute(sql);
  } catch (error) {
    /* let's cascade-drop the view and try again */
    plv8.execute(dropSql);
    plv8.execute(sql);
  }

$$ language plv8;

grant all on table xt.cntctinfo to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.cntctinfo
  do instead nothing;


create or replace rule "_UPDATE" as on update to xt.cntctinfo
  do instead nothing;


create or replace rule "_DELETE" as on delete to xt.cntctinfo
  do instead nothing;
  
