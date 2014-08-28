create or replace function xt.create_schema(sch text) returns boolean volatile as $$
declare
  count integer;
  query text;
begin

  /* Only create the schema if it hasn't been created already */
  perform *
  from information_schema.schemata
  where schema_name = sch;

  get diagnostics count = row_count;

  if (count > 0) then
    return false;
  end if;

  query = 'create schema ' || sch || ';' ||
           'grant all on schema ' || sch || ' to group xtrole;';
  execute query;

  return true;

end;
$$ language 'plpgsql';
