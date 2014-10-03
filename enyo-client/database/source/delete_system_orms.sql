do $$
 /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
    See www.xtuple.com/CPAL for the full text of the software license. */
  declare
    sqlstring text;
  begin
  select string_agg('drop view if exists ' || t.oid::regclass || ' cascade;', ' ') into sqlstring
    from pg_class t
    join pg_namespace n on n.oid = relnamespace
   where relkind = 'v'
     and nspname in ('xm','sys', 'xt');
  if length(sqlstring) > 0 then
    execute sqlstring;
  end if;

  plv8.execute("select xt.js_init();");
  plv8.execute("alter table xt.orm disable trigger orm_did_change;");
  plv8.execute("delete from xt.orm where orm_json ~ '\"isSystem\":true';");
  plv8.execute("alter table xt.orm enable trigger orm_did_change;");

$$ language plv8;
