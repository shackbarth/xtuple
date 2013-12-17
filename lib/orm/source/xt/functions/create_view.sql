/**
  Attempts to create or replace a view `view_name`. If the replace fails because of dependencies and major
  structural changes to the view, it will do a drop cascade of the view to allow it to be re-created. 
  The idea here is to minimize the work the ORM installer has to do by only dropping views with dependencies
  when absolutely necessary.

  @param {String} Schema qualified view name
  @param {String} Select statement for view
  @param {Boolean} [read_only=true] If true rules to "do nothing" will be created for insert, update and delete automatically.
*/
create or replace function xt.create_view(view_name text, select_text text, read_only boolean default true) returns boolean volatile as $$

  var dropSql = "drop view if exists " + view_name + " cascade;",
    ruleSql = "create or replace rule {name} as on {action} to " + view_name + " do instead nothing;",
    sql = "create or replace view " + view_name + " as " + select_text;

  try {
    plv8.execute(sql);
  } catch (error) {
    /* let's cascade-drop the view and try again */
    plv8.execute(dropSql);
    plv8.execute(sql);
  }

  plv8.execute("grant all on table " + view_name + " to xtrole;");

  if (read_only) {
    sql = ruleSql.replace("{name}", '"_CREATE"').replace("{action}", "insert");
    plv8.execute(sql);

    sql = ruleSql.replace("{name}", '"_UPDATE"').replace("{action}", "update");
    plv8.execute(sql);

    sql = ruleSql.replace("{name}", '"_DELETE"').replace("{action}", "delete");
    plv8.execute(sql);
  }
  
  return true

$$ language plv8;