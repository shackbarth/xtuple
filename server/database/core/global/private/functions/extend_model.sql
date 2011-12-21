create or replace function private.extend_model(context text, name text, 
                                                schema_name text, 
                                                table_name text, 
                                                join_type text, 
                                                join_clause text, 
                                                column_names text[], 
                                                rules text[] default '{}', 
                                                conditions text[] default '{}', 
                                                comment text default '', 
                                                seq_number integer default 50, 
                                                is_system boolean default false) returns void volatile as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
declare
  count integer;
  query text;
  id integer;
  was_system boolean;
begin

  select model_id, model_system into id, was_system
  from private.modelext
  where modelext_context = context
   and model_name = name;
  
  get diagnostics count = row_count;
  
  if (count > 0) then
    if (was_system and not is_system) then
      raise exception 'A system model extension already exists for %', model_name;
    end if;
    
    update private.modelext set
      model_schema_name = schema_name,
      model_table_name = table_name,
      model_columns = column_names,
      model_rules = rules,
      model_conditions = conditions,
      model_comment =  comment,
      model_system = is_system,
      modelext_seq = seq_number,
      modelext_join_type = join_type,
      modelext_join_clause = join_clause
    where model_id = id;
  else
    insert into private.modelext ( 
      model_name, model_schema_name, model_table_name, model_columns, model_rules, model_conditions, model_comment, model_system,
      modelext_context, modelext_seq, modelext_join_type, modelext_join_clause
    ) values ( 
      name, schema_name, table_name, column_names, rules , conditions, comment, is_system,
      context, seq_number, join_type, join_clause );
            
  end if;
  
end;
$$ language 'plpgsql';
