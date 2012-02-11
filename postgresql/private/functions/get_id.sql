create or replace function private.get_id(table_name text, column_name text, value_text text, id_column_name text default null, schema_name text default 'private') returns integer immutable as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
declare
  id_column text;
  query text;
  rec record;
  result integer;
begin
  id_column := coalesce(id_column_name, table_name || '_id');
  
  query = 'select ' || id_column || ' as id from ' || schema_name || '.' || table_name || ' where ' || column_name || ' = ''' || value_text || ''' order by ' || id_column || ' limit 1;';

  for rec in
    execute query
  loop
    result = rec.id;
  end loop;
  
  return coalesce(result, -1);
  
end;
$$ language 'plpgsql';
