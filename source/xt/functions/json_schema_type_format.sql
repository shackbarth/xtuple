create or replace function xt.json_schema_type_format(data_hash text) returns text as $$

  var dataHash = JSON.parse(data_hash),
      schema = dataHash.schema ? dataHash.schema : "public",
      table = dataHash.table,
      column = dataHash.column,
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      options = dataHash.options,
      sql,
      res,
      ret = {};

  /* Query to get column's PostgreSQL datatype. */
  sql = 'select data_type ' +
        'from information_schema.columns ' +
        'where 1=1 ' +
          'and table_schema = $1 ' +
          'and table_name = $2 ' +
          'and column_name = $3 ';

  res = plv8.execute(sql, [schema, table, column]);
  if(!res.length) return false;

  /* Map PostgreSQL datatype to JSON-Schema type and format. */
  /* https://developers.google.com/discovery/v1/type-format */
  switch (res[0].data_type) {
    case "ARRAY":
      ret.type = "array";
      break;
    case "bigint":
      ret.type = "integer";
      ret.format = "int32";
      break;
    case "boolean":
      ret.type = "boolean";
      break;
    case "bytea":
      ret.type = "string";
      ret.format = "byte";
      break;
    case "char":
    case "character":
    case "character varying":
      ret.type = "string";
      break;
    case "date":
      ret.type = "string";
      ret.format = "date";
      break;
    case "integer":
      ret.type = "integer";
      ret.format = "int32";
      break;
    case "numeric":
      ret.type = "number";
      ret.format = "double";
      break;
    case "text":
      ret.type = "string";
      break;
    case "timestamp without time zone":
      ret.type = "string";
      ret.format = "date-time";
      break;
    case "timestamp with time zone":
      ret.type = "string";
      ret.format = "date-time";
      break;
    default:
      throw new Error("Unsupported datatype format. No known conversion from PostgreSQL to JSON-Schema.");
      break;
  }

  /* return the results */
  return JSON.stringify(ret, null, prettyPrint);

$$ language plv8;
/*
select xt.json_schema_type_format('{
  "schema": "xtincdtpls",
  "table": "prjver",
  "column": "prjver_version",
  "prettyPrint": true
  }'
);
*/
