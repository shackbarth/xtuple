do $$
 /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */
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
end
$$;
