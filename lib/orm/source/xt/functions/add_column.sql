create or replace function xt.add_column(table_name text, column_name text, type_name text, constraint_text text default null, schema_name text default 'xt', column_comment text default null) returns boolean volatile as $$
declare
  count integer;
  query text;
  comment_query text;
begin

  perform *
  from pg_class c, pg_namespace n, pg_attribute a, pg_type t
  where c.relname = table_name
   and n.nspname = schema_name
   and a.attname = column_name
   and n.oid = c.relnamespace
   and a.attnum > 0
   and a.attrelid = c.oid
   and a.atttypid = t.oid;

  get diagnostics count = row_count;

  if (count > 0) then
    return false;
  end if;

  query = 'alter table ' || schema_name || '.' || table_name || ' add column ' || column_name || ' ' || type_name || ' ' || coalesce(constraint_text, '');

  execute query;

  if (column_comment is not null) then
    comment_query = 'comment on column ' || schema_name || '.' || table_name || '.' || column_name || ' is ' || quote_literal(column_comment);
    execute comment_query;
  end if;

  return true;

end;
$$ language 'plpgsql';
