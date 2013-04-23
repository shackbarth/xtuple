
DO $$
 /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

  var sql = "select pkghead_version from pkghead where pkghead_name = 'xt';",
    update = false,
    updVersion = '1.3.4',
    pkgVersion,
    result,
    viewname,
    i;

  result = plv8.execute(sql);
  if (result.length) {
    pkgVersion = result[0].pkghead_version.split();
    updVersion = updVersion.split();
    if (pkgVersion.length === updVersion.length) {
      while (pkgVersion.length) {
        if (pkgVersion.shift() < updVersion.shift()) {
          update = true;
          break;
        }
      }
    }
  }
  if (update) {
    sql = "select viewname from pg_views where schemaname = 'xm';"
    result = plv8.execute(sql);
    for (i = 0; i < result.length; i++) { 
      viewname = result[i].viewname;
      plv8.execute('drop view if exists xm.' + viewname + ' cascade;');
    }

    plv8.execute("select xt.js_init()");
    plv8.execute("delete from xt.orm where orm_json ~ '\"isSystem\":true';");
  }

$$ language plv8;
