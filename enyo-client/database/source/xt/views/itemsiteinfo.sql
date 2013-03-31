DO $$
  var dropSql = "drop view if exists xt.itemsiteinfo cascade;";
  var sql = "create or replace view xt.itemsiteinfo as " + 
   "select *," + 
     "xt.average_cost(itemsite_id) as avg_cost " +
   "from itemsite; ";

  try {
    plv8.execute(sql);
  } catch (error) {
    /* let's cascade-drop the view and try again */
    plv8.execute(dropSql);
    plv8.execute(sql);
  }

$$ language plv8;

grant all on table xt.itemsiteinfo to xtrole;

-- insert rules

create or replace rule "_CREATE" as on insert to xt.itemsiteinfo
  do instead nothing;


create or replace rule "_UPDATE" as on update to xt.itemsiteinfo
  do instead nothing;


create or replace rule "_DELETE" as on delete to xt.itemsiteinfo
  do instead nothing;
  
