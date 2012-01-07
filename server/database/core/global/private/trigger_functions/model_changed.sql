create or replace function private.model_changed() returns trigger as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
declare
  model_name text;
begin

  -- Validation
  if tg_op in ('INSERT','UPDATE') then
    if tg_table_name = 'modelext' then
      if coalesce(new.modelext_seq,-1) < 0 then
        raise exception 'Model extension sequence must be greater than zero';
      end if;
    end if;
    model_name = new.model_name;
  else
    model_name = old.model_name;
  end if;

   -- Remove old vew and determine whether to rebuild
  if tg_op in ('UPDATE', 'DELETE') then
    perform dropIfExists('VIEW', old.model_name, 'xm');

    -- Bail out in specific cases where it is a base model
    if tg_table_name = 'model' then
      if tg_op = 'DELETE' then
        return old;
      elsif tg_op = 'UPDATE' and not new.model_active then
        return old;
      end if;
    end if;

  else
    perform dropIfExists('VIEW', new.model_name, 'xm');
  end if;

  -- Create the new view
  perform private.create_xm_view(model_name);
  
  -- Finish up
  if tg_op = 'DELETE' then
    return old;
  end if;
  
  return new;
  
end;
$$ language 'plpgsql';
