create or replace function private.create_model(name text, 
                                                schema_name text, 
                                                table_name text, 
                                                column_names text[], 
                                                rules text[] default '{}', 
                                                conditions text[] default '{}', 
                                                order_by text[] default '{}',
                                                comment text default '', 
                                                is_system boolean default false, 
                                                is_nested boolean default false,
                                                source text default '') returns void volatile as $$
                                                
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
declare
  count integer;
  query text;
  id integer;
  was_system boolean;
  n_id integer;
begin

  select model_id, model_system into id, was_system
  from private.modelbas
  where model_name = name;
  
  get diagnostics count = row_count;
  
  if (count > 0) then
    if (was_system and not is_system) then
      raise exception 'A system model already exists for %', model_name;
    end if;
    
    update private.modelbas set
      model_schema_name = schema_name,
      model_table_name = table_name,
      model_columns = column_names,
      model_rules = rules,
      model_conditions = conditions,
      model_order = order_by,
      model_comment =  comment,
      model_system = is_system,
      modelbas_nested = is_nested,
      modelbas_source = source
    where model_id = id;
  else
    insert into private.modelbas ( 
      model_name, model_schema_name, model_table_name, model_columns, 
      model_rules, model_conditions, model_order, model_comment, model_system,
      modelbas_nested, modelbas_source
    ) values ( 
      name, schema_name, table_name, column_names, rules , conditions, 
      order_by, comment, is_system, is_nested, source );
  end if;
  
end;
$$ language 'plpgsql';

create or replace function private.create_model(name text, 
                                                schema_name text, 
                                                table_name text, 
                                                column_names text[], 
                                                rules text[] default '{}', 
                                                conditions text[] default '{}', 
                                                comment text default '', 
                                                is_system boolean default false, 
                                                is_nested boolean default false,
                                                source text default '') returns void volatile as $$
  select private.create_model($1, $2, $3, $4, $5, $6, '{}', $7, $8, $9, $10);
$$ language 'sql';
