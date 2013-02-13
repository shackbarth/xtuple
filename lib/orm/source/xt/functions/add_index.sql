create or replace function xt.add_index(table_name text, column_names text, index_name text, using_name text default 'btree', schema_name text default 'xt') returns boolean volatile as $$
declare
  count integer;
  query text;
begin

  perform *
  from pg_index
    join pg_class s on (indexrelid=s.oid)
    join pg_class f on (indrelid=f.oid)
    join pg_namespace on (f.relnamespace=pg_namespace.oid)
  where f.relname = table_name
    and nspname = schema_name
    and s.relname = index_name;
  
  get diagnostics count = row_count;
  
  if (count > 0) then
    return false;
  end if;

  query = 'create index  ' || index_name || ' on ' || schema_name || '.' || table_name || ' using ' || using_name || '(' || column_names || ');';
  execute query;

  return true;
  
end;
$$ language 'plpgsql';
