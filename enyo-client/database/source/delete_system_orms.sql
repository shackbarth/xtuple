do $$
 /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
    See www.xtuple.com/CPAL for the full text of the software license. */

  var result,
    viewname,
    schemaname,
    i,
    sql = "select schemaname, viewname " +
          "from pg_views " +
          "where schemaname in ('xm','sys', 'xt');";

  result = plv8.execute(sql);
  for (i = 0; i < result.length; i++) {
    viewname = result[i].viewname;
    schemaname = result[i].schemaname;
    plv8.execute('drop view if exists ' + schemaname + '.' + viewname + ' cascade;');
  }

  plv8.execute("alter table xt.orm disable trigger orm_did_change;");
  plv8.execute("delete from xt.orm where orm_json ~ '\"isSystem\":true';");
  plv8.execute("alter table xt.orm enable trigger orm_did_change;");

$$ language plv8;
