create or replace function private.drop_xm_view(m_name text) returns text[] as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
declare
  rec record;
  m_names text[];
  q_name text := 'xm.' || m_name;
begin

  -- Loop through xm view dependencies 
  -- (any other dependencies are not handled)
  for rec in
    select distinct relname::text as model_name
    from pg_depend
      join pg_rewrite on (pg_rewrite.oid=objid)
      join pg_class c on (c.oid=ev_class)
      join pg_namespace n on (c.relnamespace=n.oid)
    where (classid='pg_rewrite'::regclass)
     and (refclassid='pg_class'::regclass)
     and (refobjid::regclass::text = q_name)
     and (nspname || '.' || relname != q_name)
  loop

    -- drop the dependency and add
    m_names := private.drop_xm_view(rec.model_name) || m_names;

    -- Append the dropped dependency
    m_names := array_prepend(rec.model_name, m_names);
    
  end loop;

  -- Drop the view for the model name passed in
  perform dropIfExists('VIEW', m_name, 'xm');

  -- Return the dependencies
  return m_names;

end;
$$ language 'plpgsql';