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
  sql = 'select data_type, character_maximum_length ' +
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
      ret.type = "string";
      ret.format = "int64";
      ret.minimum = "-9223372036854775808";
      ret.maximum = "9223372036854775807";
      break;
    case "bigserial":
      ret.type = "string";
      ret.format = "uint64";
      ret.minimum = "1";
      ret.maximum = "9223372036854775807";
      break;
    case "boolean":
      ret.type = "boolean";
      break;
    case "bytea":
      ret.type = "string";
      break;
    case "char":
    case "character":
      ret.type = "string";
      ret.minLength = res[0].character_maximum_length ? res[0].character_maximum_length : null;
      ret.maxLength = res[0].character_maximum_length ? res[0].character_maximum_length : null;
      break;
    case "character varying":
    case "varchar":
      ret.type = "string";
      ret.maxLength = res[0].character_maximum_length ? res[0].character_maximum_length : null;
      break;
    case "date":
      ret.type = "string";
      ret.format = "date";
      break;
    case "decimal":
    case "numeric":
    case "real":
      ret.type = "number";
      ret.format = "float";
      break;
    case "double precision":
      ret.type = "number";
      ret.format = "double";
      break;
    case "integer":
      ret.type = "integer";
      ret.format = "int32";
      ret.minimum = "-2147483648";
      ret.maximum = "2147483647";
      break;
    case "money":
      ret.type = "number";
      ret.format = "float";
      ret.minimum = "-92233720368547758.08";
      ret.maximum = "92233720368547758.07";
      break;
    case "serial":
      ret.type = "integer";
      ret.format = "uint32";
      ret.minimum = "1";
      ret.maximum = "2147483647";
      break;
    case "smallint":
      ret.type = "integer";
      ret.format = "int32";
      ret.minimum = "-32768";
      ret.maximum = "32767";
      break;
    case "text":
      ret.type = "string";
      break;
    case "time":
    case "time without time zone":
      ret.type = "string";
      ret.format = "time";
      break;
    case "timestamp":
    case "timestamp without time zone":
      ret.type = "string";
      ret.format = "date-time";
      break;
    case "time with time zone":
    case "timestamptz":
    case "timestamp with time zone":
      ret.type = "string";
      ret.format = "date-time";
      break;
    case "unknown":
    case "USER-DEFINED":
      ret.type = "string";
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
