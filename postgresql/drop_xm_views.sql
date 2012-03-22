DO $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
  var sql = "select dropifexists('VIEW', viewname, schemaname, true) "
            + "from pg_views "
            + "where schemaname = 'xm';",
     result;

  result = executeSql(sql);
  return result;

$$ language plv8;