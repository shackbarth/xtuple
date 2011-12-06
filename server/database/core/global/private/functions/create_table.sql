create or replace function private.create_table(table_name text, schema_name text default 'private', with_oids boolean default false) returns boolean volatile as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
declare
  count integer;
  query text;
  with_clause text := '';
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

  query = 'create table ' || schema_name || '.' || table_name || '()' || with_clause || '; 
           grant all on ' || schema_name || '.' || table_name || ' to xtrole;';
  execute query;

  return true;
  
end;
$$ language 'plpgsql';
