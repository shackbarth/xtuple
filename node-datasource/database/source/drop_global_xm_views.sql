DO $$
 /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

  var sql = "select viewname from pg_views where schemaname = 'xm';",
    result,
    viewname,
    i;

  result = plv8.execute(sql);
  for (i = 0; i < result.length; i++) {
    viewname = result[i].viewname;
    plv8.execute('drop view if exists xm.' + viewname + ' cascade;');
  }
  return true;

$$ language plv8;
