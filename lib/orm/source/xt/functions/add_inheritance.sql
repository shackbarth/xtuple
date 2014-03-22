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
    if (parent_table_name = 'xt.obj') then
      query = 'alter table ' || child_table_name || ' no inherit ' || parent_table_name || ';';
      execute query;
    end if;

    return false;
  end if;

  -- TODO: We can't inherit from xt.obj because it messes up the column order on restore.
  if (parent_table_name != 'xt.obj') then
    query = 'alter table ' || child_table_name || ' inherit ' || parent_table_name || ';';
    execute query;
  end if;

  return true;

end;
$$ language 'plpgsql';
