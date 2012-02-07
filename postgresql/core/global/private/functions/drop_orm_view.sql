create or replace function private.drop_orm_view(orm_name text) returns text[] as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
declare
  rec record;
  orm_names text[] := '{}';
  q_name text := 'xm.' || orm_name;
begin

  -- Loop through xm view dependencies 
  -- (any other dependencies are not handled)
  for rec in
    select distinct relname::text as orm_name
    from pg_depend
      join pg_rewrite on (pg_rewrite.oid=objid)
      join pg_class c on (c.oid=ev_class)
      join pg_namespace n on (c.relnamespace=n.oid)
    where (classid='pg_rewrite'::regclass)
     and (refclassid='pg_class'::regclass)
     and (refobjid::regclass::text = q_name)
     and (nspname || '.' || relname != q_name)
  loop

    -- Drop the dependency and add
    orm_names := private.drop_orm_view(rec.orm_name) || orm_names;

    -- If the model we're on isnt already in the array, prepend the dropped dependency
   if not rec.orm_name <@ orm_names then
      orm_names := array_prepend(rec.orm_name, orm_names);
   end if;
    
  end loop;

  -- Drop the view for the model name passed in
  perform dropIfExists('VIEW', orm_name, 'xm');

  -- Return the dependencies
  return orm_names;

end;
$$ language 'plpgsql';