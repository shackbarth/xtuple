DO $$
  var dropSql = "drop view if exists xt.iteminfo cascade;";
  var sql = "create or replace view xt.iteminfo as  " +
   "select *, " +
     "stdcost(item_id) as std_cost, " +
     "iteminvpricerat(item_id) as inv_price_ratio " +
   "from item; " ;

  try {
    plv8.execute(sql);
  } catch (error) {
    /* let's cascade-drop the view and try again */
    plv8.execute(dropSql);
    plv8.execute(sql);
  }

$$ language plv8;


grant all on table xt.iteminfo to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.iteminfo
  do instead nothing;


create or replace rule "_UPDATE" as on update to xt.iteminfo
  do instead nothing;


create or replace rule "_DELETE" as on delete to xt.iteminfo
  do instead nothing;
  
