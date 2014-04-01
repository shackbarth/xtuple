do $$
declare
  count integer;
  query text;
begin
  /* Only create the schema if it hasn't been created already */
  perform *
  from information_schema.schemata 
  where schema_name = 'xt';

  get diagnostics count = row_count;

  if (count > 0) then
    return;
  end if;

  query = 'create schema xt;';
  execute query;

  query = 'grant all on schema xt to group xtrole;';
  execute query;

end;
$$ language 'plpgsql';
