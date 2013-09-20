create or replace function xt.add_inheritance(child_table_name text, parent_table_name text) returns boolean volatile as $$
declare
  count integer;
  query text;
begin

  perform * 
  from pg_inherits
  where inhrelid = child_table_name::regclass::oid
  and inhparent = parent_table_name::regclass::oid;
  
  get diagnostics count = row_count;
  
  if (count > 0) then
    return false;
  end if;

  query = 'alter table ' || child_table_name || ' inherit ' || parent_table_name || ';';
  execute query;

  return true;
  
end;
$$ language 'plpgsql';
