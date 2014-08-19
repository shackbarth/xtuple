create or replace function xt.create_schema(schema_name text) returns boolean volatile as $$
  /* Only create the schema if it hasn't been created already */
  var res, sql = "select schema_name from information_schema.schemata where schema_name = $1",
  res = plv8.execute(sql, [schema_name]);
  if (!res.length) {
    sql = "create schema %1$I; grant all on schema %1$I to group xtrole;"
    plv8.execute(XT.format(sql, [schema_name]));
  }
$$ language plv8;
