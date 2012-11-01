select xt.install_js('XT','Schema','xtuple', $$

  /**
    @class

    The XT.Schema class includes all functions necessary to return a JSON-Schema
    (http://tools.ietf.org/html/draft-zyp-json-schema-03) for the ORMs.
  */

  XT.Schema = {};

  /**
    Return a JSON-Schema property object that MAY include type, format, required
    minimum/maximum number, minLength/maxLength string based on a column's
    PostgreSQL information_schema.columns record.

    @param {String} An ORM's "table" property formated like "schema.table" or "table".
    @param {String} Am ORM's properties' "column" attibute  formatted like "column_name".
    @returns {Object}
  */
  XT.Schema.columnInfo = function(ormSchemaTable, ormColumn) {
    var schema,
        table,
        schemaTable,
        sql,
        res,
        ret = {};

    /* Get the schema and table from the ORM table property. */
    schemaTable = ormSchemaTable.split(".");
    if (!schemaTable[1]) {
      schema = "public";
      table = schemaTable[0];
    } else {
      schema = schemaTable[0];
      table = schemaTable[1];
    }

    /* Query to get column's PostgreSQL datatype and other schema info. */
    sql = 'select ' +
            'data_type, ' +
            'character_maximum_length, ' +
            'is_nullable ' +
          'from information_schema.columns ' +
          'where 1=1 ' +
            'and table_schema = $1 ' +
            'and table_name = $2 ' +
            'and column_name = $3 ';

    res = plv8.execute(sql, [schema, table, ormColumn]);
    if (!res.length) return false;

    /* Set "required" if column is not "is_nullable". */
    if (res[0].is_nullable === "NO") {
      ret.required = true;
    }

    /* Map PostgreSQL datatype to JSON-Schema type and format. */
    /* https://developers.google.com/discovery/v1/type-format */
    /* type: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.1 */
    /* format: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.23 */
    /* min max: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.9 */
    /* lenght: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.17 */
    /* required: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.7 */
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
    return ret;
  }

$$ );
