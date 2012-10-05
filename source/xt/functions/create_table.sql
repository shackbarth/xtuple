create or replace function xt.create_table(table_name text, schema_name text default 'xt', with_oids boolean default false, inherit_table text default null) returns boolean volatile as $$
declare
  count integer;
  query text;
  with_clause text := '';
  inherit_from text := '';
begin

  perform *
  from pg_tables 
  where schemaname = schema_name and tablename = table_name;
  
  get diagnostics count = row_count;
  
  if (count > 0) then
    return false;
  end if;

  if (with_oids) then
    with_clause := 'with (OIDS=TRUE)';
  end if;

  if (inherit_table is not null) then
    inherit_from := ' INHERITS (' || inherit_table || ') ';
  end if;

  query = 'create table ' || schema_name || '.' || table_name || '()' || inherit_from || with_clause || '; 
           grant all on ' || schema_name || '.' || table_name || ' to xtrole;';
  execute query;

  return true;
  
end;
$$ language 'plpgsql';
