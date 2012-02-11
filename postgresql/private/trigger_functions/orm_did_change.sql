create or replace function private.orm_did_change() returns trigger as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
declare
  orm_name text;
  orm_names text[];
  i integer := 1;
begin

  -- Validate
  if tg_op in ('INSERT','UPDATE') then
    orm_name = new.orm_name;
  else
    orm_name = old.orm_name;
  end if;

  -- Drop the view, a text array of dependent view model names will be returned 
  orm_names := private.drop_orm_view(orm_name);

   -- Determine whether to rebuild
  if tg_op in ('UPDATE', 'DELETE') then
    if not old.orm_ext then -- is base map
      if tg_op = 'DELETE' then
        if array_upper(orm_names, 1) > 0 then
          raise exception E'Can not delete model \'%\' because it has the following dependencies: %', orm_name, array_to_string(orm_names, ',');
        else
          return old;
        end if;
      elsif tg_op = 'UPDATE' and not new.orm_active then
        if array_upper(orm_names, 1) > 0 then
          raise exception E'Can not deactivate model \'%\' because it has the following dependencies: %', orm_name, array_to_string(orm_names, ',');
        else
          return old;
        end if;
      end if;
    end if;
  end if;

  -- Add the map we're working on to the array of model names
  orm_names := array_prepend(orm_name, orm_names);

  -- Loop through model names and create
  if tg_op in ('INSERT', 'UPDATE') then  
    for i in 1..array_upper(orm_names, 1)
    loop
      perform private.create_orm_view(orm_names[i]);
    end loop;
  end if;
  
  -- Finish up
  if tg_op = 'DELETE' then
    return old;
  end if;
  
  return new;
  
end;
$$ language 'plpgsql';
