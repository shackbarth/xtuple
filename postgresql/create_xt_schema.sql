do $$
  /* Only create the schema if it hasn't been created already */
  var res, sql = "select schema_name from information_schema.schemata where schema_name = 'xt'",
  res = plv8.execute(sql);
  if (!res.length) {
    sql = "create schema xt; grant all on schema xt to group xtrole;"
  }
$$ language plv8;

-- Put schema in path
-- TODO: This can be removed if and when these scripts are converted to a package
insert into schemaord (schemaord_name, schemaord_order) 
select 'xt', 0
where not exists (
  select * 
  from schemaord 
  where schemaord_name='xt');

