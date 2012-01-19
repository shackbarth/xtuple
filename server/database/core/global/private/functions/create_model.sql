create or replace function private.create_model(name text, schema_name text, table_name text, column_names text[], rules text[] default '{}', conditions text[] default '{}', comment text default '', is_system boolean default false, is_nested boolean default false) returns void volatile as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
declare
  count integer;
  query text;
  id integer;
  was_system boolean;
  n_id integer;
  ins_nested boolean := false;
begin

  select model_id, model_system into id, was_system
  from only private.model
  where model_name = name;
  
  get diagnostics count = row_count;
  
  if (count > 0) then
    if (was_system and not is_system) then
      raise exception 'A system model already exists for %', model_name;
    end if;
    
    update private.model set
      model_schema_name = schema_name,
      model_table_name = table_name,
      model_columns = column_names,
      model_rules = rules,
      model_conditions = conditions,
      model_comment =  comment,
      model_system = is_system
    where model_id = id;

    select nested_id into n_id
    from private.nested
    where nested_model_id = id;

    if (found) then
      if (not is_nested) then
        delete from private.nested where nested_id = n_id;
      end if;
    else
      ins_nested = is_nested;
    end if;
  else
    id := nextval('private.model_model_id_seq');
    
    insert into private.model ( 
      model_id, model_name, model_schema_name, model_table_name, model_columns, model_rules, model_conditions, model_comment, model_system
    ) values ( 
      id, name, schema_name, table_name, column_names, rules , conditions, comment, is_system );

    ins_nested := is_nested;
  end if;

  if (ins_nested) then
    insert into private.nested ( nested_model_id ) values ( id );
  end if;
  
end;
$$ language 'plpgsql';
