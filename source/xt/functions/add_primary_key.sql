create or replace function xt.add_primary_key(table_name text, column_name text, schema_name text default 'xt') returns boolean volatile as $$
declare
  count integer;
  query text;
begin

  perform *
  from pg_constraint
    join pg_namespace on (connamespace=pg_namespace.oid)
    join pg_class f on (conrelid=f.oid)
  where f.relname = table_name
    and nspname = schema_name
    and contype = 'p';
  
  get diagnostics count = row_count;
  
  if (count > 0) then
    return false;
  end if;

  query = 'alter table ' || schema_name || '.' || table_name || ' add primary key (' || column_name || ');';
  execute query;

  return true;
  
end;
$$ language 'plpgsql';
