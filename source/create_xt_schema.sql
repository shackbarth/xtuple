do $$
  /* Only create the schema if it hasn't been created already */
  var res, sql = "select schema_name from information_schema.schemata where schema_name = 'xt'",
  res = plv8.execute(sql);
  if (!res.length) {
    sql = "create schema xt; grant all on schema xt to group xtrole;"
    plv8.execute(sql);
  }
$$ language plv8;

