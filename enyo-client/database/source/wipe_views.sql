DO $$
 /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

  var sql,
    result,
    viewname,
    schemaname,
    i;

  sql = "select schemaname, viewname from pg_views where schemaname in ('xm','sys', 'xt');"
  result = plv8.execute(sql);
  for (i = 0; i < result.length; i++) {
    viewname = result[i].viewname;
    schemaname = result[i].schemaname;
    plv8.execute('drop view if exists ' + schemaname + '.' + viewname + ' cascade;');
  }

$$ language plv8;
