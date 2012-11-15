do $$
  /* Only create the schema if it hasn't been created already */
  var res, sql = "select schema_name from information_schema.schemata where schema_name = 'xc'",
  res = plv8.execute(sql);
  if (!res.length) {
    sql = "create schema xc; grant all on schema xc to group xtrole;"
    plv8.execute(sql);
  }
$$ language plv8;



