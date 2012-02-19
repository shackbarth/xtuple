create or replace function xt.view_dependencies(view_name text) returns text[] as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select xt.js_init()');
  
  var rec, viewNames = [], 
      viewName = JSON.stringify(view_name),
      rel = view_name.afterDot(), 
      nsp = view_name.beforeDot(),
      sql = 'select distinct relname::text as "viewName" '
          + 'from pg_depend '
          + 'join pg_rewrite on (pg_rewrite.oid=objid) '
          + 'join pg_class c on (c.oid=ev_class) '
          + 'join pg_namespace n on (c.relnamespace=n.oid) '
          + "where (classid='pg_rewrite'::regclass) "
          + " and (refclassid='pg_class'::regclass) "
          + ' and (refobjid::regclass::text = $1) '
          + " and (nspname || '.' || relname != $1) "

  rec = executeSql(sql, [view_name])

  /*  Loop through view dependencies */
  for(var i = 0; i < rec.length; i++) {
    var sql = "select xt.view_dependencies($1 || '.' || $2) as result",
        viewName = rec[i].viewName,
        res = executeSql(sql, [nsp, viewName])[0].result;
 
    for(var r = 0; r < res.length; r++) {
      if(viewNames.contains(res[r])) {
        viewNames.splice(viewNames.indexOf(res[r]), 1);
      }
      viewNames.push(res[r]);  
    }
  }

  /* If the view we're on isnt already in the array, prepend the dependency */
  if(!viewNames.contains(view_name)) viewNames.unshift(view_name);

  /* Return the dependencies */
  return viewNames;

$$ language plv8;
