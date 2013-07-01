DO $$
 /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

  var result,
    viewname,
    i;

  sql = "select viewname from pg_views where schemaname = 'xm';"
  result = plv8.execute(sql);
  for (i = 0; i < result.length; i++) {
    viewname = result[i].viewname;
    plv8.execute('drop view if exists xm.' + viewname + ' cascade;');
  }

  sql = "select viewname from pg_views where schemaname = 'sys';"
  result = plv8.execute(sql);
  for (i = 0; i < result.length; i++) {
    viewname = result[i].viewname;
    plv8.execute('drop view if exists sys.' + viewname + ' cascade;');
  }

  plv8.execute("select xt.js_init()");
  plv8.execute("delete from xt.orm where orm_json ~ '\"isSystem\":true';");

$$ language plv8;

