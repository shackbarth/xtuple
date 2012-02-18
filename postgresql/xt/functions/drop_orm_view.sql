create or replace function xt.drop_orm_view(view_name text) returns text[] as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
declare
  rec record;
  view_names text[] := '{}';
  rel text := substring(view_name from position('.' in view_name) + 1);
  nsp text := substring(view_name from 0 for position('.' in view_name));
begin

  -- Loop through xm view dependencies 
  -- (any other dependencies are not handled)
  for rec in
    select distinct relname::text as view_name
    from pg_depend
      join pg_rewrite on (pg_rewrite.oid=objid)
      join pg_class c on (c.oid=ev_class)
      join pg_namespace n on (c.relnamespace=n.oid)
    where (classid='pg_rewrite'::regclass)
     and (refclassid='pg_class'::regclass)
     and (refobjid::regclass::text = view_name)
     and (nspname || '.' || relname != view_name)
  loop
    -- Drop the dependency and add
    view_names := xt.drop_orm_view(nsp || '.' || rec.view_name) || view_names;

    -- If the model we're on isnt already in the array, prepend the dropped dependency
   if not rec.view_name <@ view_names then
      view_names := array_prepend(nsp || '.' || rec.view_name, view_names);
   end if;
    
  end loop;

  -- Drop the view for the model name passed in
  perform dropIfExists('VIEW', rel, nsp);

  -- Return the dependencies
  return view_names;

end;
$$ language 'plpgsql';
