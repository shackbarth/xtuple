create or replace function private.model_changed() returns trigger as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
declare
  m_name text;
  m_names text[];
  i integer := 1;
begin

  -- Validate
  if tg_op in ('INSERT','UPDATE') then
    if tg_table_name = 'modelext' then
      if coalesce(new.modelext_seq,-1) < 0 then
        raise exception 'Model extension sequence must be greater than zero';
      end if;
    end if;
    m_name = new.model_name;
  else
    m_name = old.model_name;
  end if;

  -- Drop the view, a text array of dependent view model names will be returned 
  m_names := private.drop_xm_view(m_name);

   -- Determine whether to rebuild
  if tg_op in ('UPDATE', 'DELETE') then
    if tg_table_name = 'model' then
      if tg_op = 'DELETE' then
        if array_upper(m_names, 1) > 0 then
          raise exception 'Can not delete model % because it has the following dependencies: %', m_name, array_to_string(m_names, ',');
        else
          return old;
        end if;
      elsif tg_op = 'UPDATE' and not new.model_active then
        if array_upper(m_names, 1) > 0 then
          raise exception 'Can not deactivate model % because it has the following dependencies: %', m_name, array_to_string(m_names, ',');
        else
          return old;
        end if;
      end if;
    end if;
  end if;

  -- Add the model we're working on to the array of model names
  m_names := array_prepend(m_name, m_names);

  -- Loop through model names and create
  for i in 1..array_upper(m_names, 1)
  loop
    perform private.create_xm_view(m_names[i]);
  end loop;
  
  -- Finish up
  if tg_op = 'DELETE' then
    return old;
  end if;
  
  return new;
  
end;
$$ language 'plpgsql';
