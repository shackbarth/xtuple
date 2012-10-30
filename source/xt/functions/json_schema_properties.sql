create or replace function xt.json_schema_properties(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
      ormNamespace = dataHash.ormNamespace,
      ormType = dataHash.ormType,
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      options = dataHash.options,
      schemaTable,
      schema,
      table,
      column,
      test,
      orm = {},
      i,
      sql,
      res = {},
      formatres = {},
      ret = {},
      test = {};

  res = XT.Orm.fetch(ormNamespace, ormType);

  /* Get the schema and table from the ORM table property. */
  schemaTable = res.table.split(".");
  if(!schemaTable[1]) {
    schema = "public";
    table = schemaTable[0];
  } else {
    schema = schemaTable[0];
    table = schemaTable[1];
  }

  /* Loop through the ORM properties and get the columns. */
  for (i = 0; i < res.properties.length; i++) {
    if(res.properties[i].attr && res.properties[i].attr.column) {
      column = res.properties[i].attr.column;
      orm.schema = schema;
      orm.table = table;
      orm.column = column;
      orm.prettyPrint = prettyPrint;

      /* Query to get column's PostgreSQL datatype. */
      test = JSON.stringify(orm);
      sql = 'select xt.json_schema_type_format($1)';
      formatres = plv8.execute(sql, [test]);
      ret = JSON.parse(formatres);
      if(!ret.length) return false;
    }
  }


  /* return the results */
  return JSON.stringify(orm, null, prettyPrint);

$$ language plv8;
/*
select xt.json_schema_properties('{
  "ormNamespace": "XM",
  "ormType": "OpportunityIncident",
  "prettyPrint": true
  }'
);
*/
