select xt.install_js('XT','Schema','xtuple', $$

  /**
   * @class
   *
   * The XT.Schema class includes all functions necessary to return a JSON-Schema
   * (http://tools.ietf.org/html/draft-zyp-json-schema-03) for the ORMs.
   */

  XT.Schema = {};

  XT.Schema.isDispatchable = true;

  /**
   * Return a JSON-Schema property object that MAY include type, format, required
   * minimum/maximum number, minLength/maxLength string based on a column's
   * PostgreSQL information_schema.columns record.
   *
   * @param {String} An ORM's "table" property formated like "schema.table" or "table".
   * @param {String} An ORM's properties' "column" attibute  formatted like "column_name".
   * @returns {Object}
   */
  XT.Schema.columnInfo = function(ormSchemaTable, ormColumn) {
    var schema,
        table,
        func,
        schemaTable,
        sql,
        funcSql,
        res,
        funcRes,
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

    /* Check if this is a function and not a table. */
    if (table.indexOf("(") !== -1) {
      /* Extract just the function name from table. */
      func = table.substring(0,table.indexOf("("));

      /* Look up the "RETURNS SETOF" type. */
      funcSql = 'select ' +
                  'type_udt_schema, ' +
                  'type_udt_name ' +
                'from information_schema.routines ' +
                'where 1=1 ' +
                  'and specific_schema = $1 ' +
                  'and routine_name = $2; ';

      funcRes = plv8.execute(funcSql, [schema, func]);

      if (funcRes.length === 1) {
        /* Name of the schema that the return data type of the function is defined in. */
        schema = funcRes[0].type_udt_schema;
        /* Name of the return data type of the function. */
        table = funcRes[0].type_udt_name;
      }
    }

    /* Query to get column's PostgreSQL datatype and other schema info. */
    sql = 'select ' +
            'data_type, ' +
            'character_maximum_length, ' +
            'is_nullable, ' + /* Pull in required from NOT NULL in database. */
            'CASE ' +
              "WHEN column_default ILIKE 'nextval%' THEN 'AUTO_INCREMENT' " +
              'ELSE NULL ' +
            'END AS column_default, ' + /* Used to determine if integer is really an AUTO_INCREMENT serial. */
            'col_description( ' + /* Pull in column comments from db. */
              '( ' +
                'select ' +
                        'oid ' +
                'from pg_class ' +
                'where 1=1 ' +
                        'and relname = information_schema.columns.table_name ' +
                        'and relnamespace = (select oid from pg_namespace where nspname = information_schema.columns.table_schema) ' +
              ')::oid, ' +
              'ordinal_position ' +
            ') AS comment ' +
          'from information_schema.columns ' +
          'where 1=1 ' +
            'and table_schema = $1 ' +
            'and table_name = $2 ' +
            'and column_name = $3 ';

    res = plv8.execute(sql, [schema, table, ormColumn]);
    if (!res.length) return false;


    /* Set "description" if column "comment" is not null. */
    if (res[0].comment) {
      ret.description = res[0].comment;
    }

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
        /* http://www.postgresql.org/docs/9.1/static/datatype-numeric.html#DATATYPE-SERIAL */
        if (res[0].is_nullable === "NO" && res[0].column_default === "AUTO_INCREMENT") {
          ret.type = "string";
          ret.format = "uint64";
          ret.minimum = "1";
          ret.maximum = "9223372036854775807";
        } else {
          ret.type = "string";
          ret.format = "int64";
          ret.minimum = "-9223372036854775808";
          ret.maximum = "9223372036854775807";
        }
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
        /* http://www.postgresql.org/docs/9.1/static/datatype-numeric.html#DATATYPE-SERIAL */
        if (res[0].is_nullable === "NO" && res[0].column_default === "AUTO_INCREMENT") {
          ret.type = "integer";
          ret.format = "uint32";
          ret.minimum = "1";
          ret.maximum = "2147483647";
        } else {
          ret.type = "integer";
          ret.format = "int32";
          ret.minimum = "-2147483648";
          ret.maximum = "2147483647";
        }
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

  /**
   * Return a JSON-Schema for an ORM to be used for an API Discovery Service
   * resource's "properties".
   *
   * @param {Object} An ORM object or a basic one with just orm.nameSpace and orm.type.
   * @returns {Object}
   */
  XT.Schema.getProperties = function(orm) {
    /* Load ORM if this function was called with just orm.nameSpace and orm.type. */
    orm = orm.properties ? orm : XT.Orm.fetch(orm.nameSpace, orm.type);

    var schemaTable = orm.table,
        column,
        columns = [],
        schemaColumnInfo = {},
        ret = {};

    if (!orm.properties) return false;

    /* Loop through the ORM properties and get the columns. */
    for (var i = 0; i < orm.properties.length; i++) {
      if (!ret.properties) {
        /* Initialize properties. */
        ret.properties = {};
      }

      /* Add title and description properties. */
      /* For readability only, title should be first, therefore a redundant if. */
      if ((orm.properties[i].attr && orm.properties[i].attr.column)
        || (orm.properties[i].toOne)
        || (orm.properties[i].toMany)) {

        /* Initialize named properties. */
        ret.properties[orm.properties[i].name] = {};
        ret.properties[orm.properties[i].name].title = orm.properties[i].name.humanize();
      }

      /* Basic property */
      if (orm.properties[i].attr && orm.properties[i].attr.column) {
        column = orm.properties[i].attr.column;
        columns.push(column);

        /* Get column's PostgreSQL datatype info. */
        schemaColumnInfo = XT.Schema.columnInfo(schemaTable, column);
        if (!schemaColumnInfo) {
          return false;
        }

        /* Loop through the returned schemaColumnInfo properties and add them. */
        for (var attrname in schemaColumnInfo) {
          ret.properties[orm.properties[i].name][attrname] = schemaColumnInfo[attrname];
        }

        /* Add required override based off of ORM's property. */
        if (orm.properties[i].attr.required) {
          ret.properties[orm.properties[i].name].required = true;
        }

        /* Add primary key flag. This isn't part of JSON-Schema, but very useful for URIs. */
        /* example.com/resource/{primaryKey} */
        /* JSON-Schema allows for additional custom properites like this. */
        if (orm.properties[i].attr.isPrimaryKey) {
          ret.properties[orm.properties[i].name].isPrimaryKey = true;
        }
      }
      /* toOne property */
      else if (orm.properties[i].toOne) {
        ret.properties[orm.properties[i].name].type = "object";
        ret.properties[orm.properties[i].name]["$ref"] = orm.properties[i].toOne.type;

        /* Add required override based off of ORM's property. */
        if (orm.properties[i].toOne.required) {
          ret.properties[orm.properties[i].name].required = true;
        }
      }
      /* toMany property */
      else if (orm.properties[i].toMany) {
        ret.properties[orm.properties[i].name].type = "array";

        /* Add required override based off of ORM's property. */
        if (orm.properties[i].toMany.required) {
          ret.properties[orm.properties[i].name].required = true;
        }

        if (orm.properties[i].toMany.isNested) {
          ret.properties[orm.properties[i].name].items = {"$ref": orm.properties[i].toMany.type};
        }
      }
      /* Error */
      else {
        /* You broke it. We should not be here. */
        throw new Error("Invalid ORM property. Unable to generate JSON-Schema from this ORM.");
      }
    }






    /* Assign column attributes in one call. */
    var schemaColumnInfo2 = XT.Schema.columnInfo2(schemaTable, column2);
    for (var i = 0; i < ret.properties.length; i++) {

      /* Basic properties only. */
      if (ret.properties[i].attr && ret.properties[i].attr.column) {
        /* Get column's PostgreSQL datatype info. */
        schemaColumnInfo = XT.Schema.columnInfo(schemaTable, column);
        if (!schemaColumnInfo) {
          return false;
        }

        /* Loop through the returned schemaColumnInfo properties and add them. */
        for (var attrname in schemaColumnInfo2) {
          ret.properties[i].name[attrname] = schemaColumnInfo[attrname];
        }
      }
    }






    /* If this ORM has no column properties, we have an empty object, return false. */
    if (!ret.properties || !Object.keys(ret.properties).length > 0) {
      return false;
    }

    /* return the results */
    return ret;
  }

  /**
   * Return an array of requiredAttributes or columns that can not be NULL for an ORM.
   *
   * @param {Object} An ORM object or a basic one with just orm.nameSpace and orm.type.
   * @returns {Array}
   */
  XT.Schema.getRequiredAttributes = function(orm) {
    /* Load ORM if this function was called with just orm.nameSpace and orm.type. */
    orm = orm.properties ? orm : XT.Orm.fetch(orm.nameSpace, orm.type);

    var schemaTable = orm.table,
      column,
      schemaColumnInfo = {},
      ret = [];

    if (!orm.properties) return false;

    /* Loop through the ORM properties and get the columns. */
    for (var i = 0; i < orm.properties.length; i++) {

      /* Basic property */
      if (orm.properties[i].attr && orm.properties[i].attr.column) {
        column = orm.properties[i].attr.column;

        /* Get column's PostgreSQL datatype info. */
        schemaColumnInfo = XT.Schema.columnInfo(schemaTable, column);
        if (!schemaColumnInfo) return false;

        /* Get required from the returned schemaColumnInfo properties. */
        if (schemaColumnInfo.required) {
          ret.push(orm.properties[i].name);
        }

        /* Add required override based off of ORM's property. */
        if (orm.properties[i].attr.required) {
          ret.push(orm.properties[i].name);
        }
      }
      /* toOne property */
      else if (orm.properties[i].toOne) {
        /* Add required override based off of ORM's property. */
        if (orm.properties[i].toOne.required) {
          ret.push(orm.properties[i].name);
        }
      }
      /* toMany property */
      else if (orm.properties[i].toMany) {
        /* Add required override based off of ORM's property. */
        if (orm.properties[i].toMany.required) {
          ret.push(orm.properties[i].name);
        }
      }
      /* Error */
      else {
        /* You broke it. We should not be here. */
        throw new Error("Invalid ORM property. Unable to generate requiredAttributes from this ORM.");
      }
    }

    /* If this ORM has no column properties, we have an empty object, return false. */
    if (!ret.length > 0) return false;

    /* return the results */
    return ret;
  }

  /**
   * Return a JSON-Schema property object that MAY include type, format, required
   * minimum/maximum number, minLength/maxLength string based on a column's
   * PostgreSQL information_schema.columns record.
   *
   * @param {String} An ORM's "table" property formated like "schema.table" or "table".
   * @param {String} An ORM's properties' "column" attibute  formatted like "column_name".
   * @returns {Object}
   */
  XT.Schema.columnInfo2 = function(ormSchemaTable, ormColumns) {
    var schema,
        table,
        func,
        schemaTable,
        sql,
        funcSql,
        res,
        funcRes,
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

    /* Check if this is a function and not a table. */
    if (table.indexOf("(") !== -1) {
      /* Extract just the function name from table. */
      func = table.substring(0,table.indexOf("("));

      /* Look up the "RETURNS SETOF" type. */
      funcSql = 'select ' +
                  'type_udt_schema, ' +
                  'type_udt_name ' +
                'from information_schema.routines ' +
                'where 1=1 ' +
                  'and specific_schema = $1 ' +
                  'and routine_name = $2; ';

      funcRes = plv8.execute(funcSql, [schema, func]);

      if (funcRes.length === 1) {
        /* Name of the schema that the return data type of the function is defined in. */
        schema = funcRes[0].type_udt_schema;
        /* Name of the return data type of the function. */
        table = funcRes[0].type_udt_name;
      }
    }

    /* Query to get column's PostgreSQL datatype and other schema info. */
    sql = 'select ' +
            'column_name' +
            'data_type, ' +
            'character_maximum_length, ' +
            'is_nullable, ' + /* Pull in required from NOT NULL in database. */
            'CASE ' +
              "WHEN column_default ILIKE 'nextval%' THEN 'AUTO_INCREMENT' " +
              'ELSE NULL ' +
            'END AS column_default, ' + /* Used to determine if integer is really an AUTO_INCREMENT serial. */
            'col_description( ' + /* Pull in column comments from db. */
              '( ' +
                'select ' +
                        'oid ' +
                'from pg_class ' +
                'where 1=1 ' +
                        'and relname = information_schema.columns.table_name ' +
                        'and relnamespace = (select oid from pg_namespace where nspname = information_schema.columns.table_schema) ' +
              ')::oid, ' +
              'ordinal_position ' +
            ') AS comment ' +
          'from information_schema.columns ' +
          'where 1=1 ' +
            'and table_schema = $1 ' +
            'and table_name = $2 ' +
            'and column_name in $3 ';

    res = plv8.execute(sql, [schema, table, ormColumns]);
    if (!res.length) return false;

    for (var i = 0; i < res.length; i++) {
      /* Set "description" if column "comment" is not null. */
      if (res[i].comment) {
        ret[res[i].column_name].description = res[i].comment;
      }

      /* Set "required" if column is not "is_nullable". */
      if (res[i].is_nullable === "NO") {
        ret[res[i].column_name].required = true;
      }

      /* Map PostgreSQL datatype to JSON-Schema type and format. */
      /* https://developers.google.com/discovery/v1/type-format */
      /* type: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.1 */
      /* format: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.23 */
      /* min max: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.9 */
      /* lenght: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.17 */
      /* required: http://tools.ietf.org/html/draft-zyp-json-schema-03#section-5.7 */
      switch (res[i].data_type) {
        case "ARRAY":
          ret[res[i].column_name].type = "array";
          break;
        case "bigint":
          /* http://www.postgresql.org/docs/9.1/static/datatype-numeric.html#DATATYPE-SERIAL */
          if (res[i].is_nullable === "NO" && res[i].column_default === "AUTO_INCREMENT") {
            ret[res[i].column_name].type = "string";
            ret[res[i].column_name].format = "uint64";
            ret[res[i].column_name].minimum = "1";
            ret[res[i].column_name].maximum = "9223372036854775807";
          } else {
            ret[res[i].column_name].type = "string";
            ret[res[i].column_name].format = "int64";
            ret[res[i].column_name].minimum = "-9223372036854775808";
            ret[res[i].column_name].maximum = "9223372036854775807";
          }
          break;
        case "bigserial":
          ret[res[i].column_name].type = "string";
          ret[res[i].column_name].format = "uint64";
          ret[res[i].column_name].minimum = "1";
          ret[res[i].column_name].maximum = "9223372036854775807";
          break;
        case "boolean":
          ret[res[i].column_name].type = "boolean";
          break;
        case "bytea":
          ret[res[i].column_name].type = "string";
          break;
        case "char":
        case "character":
          ret[res[i].column_name].type = "string";
          ret[res[i].column_name].minLength = res[i].character_maximum_length ? res[i].character_maximum_length : null;
          ret[res[i].column_name].maxLength = res[i].character_maximum_length ? res[i].character_maximum_length : null;
          break;
        case "character varying":
        case "varchar":
          ret[res[i].column_name].type = "string";
          ret[res[i].column_name].maxLength = res[i].character_maximum_length ? res[i].character_maximum_length : null;
          break;
        case "date":
          ret[res[i].column_name].type = "string";
          ret[res[i].column_name].format = "date";
          break;
        case "decimal":
        case "numeric":
        case "real":
          ret[res[i].column_name].type = "number";
          ret[res[i].column_name].format = "float";
          break;
        case "double precision":
          ret[res[i].column_name].type = "number";
          ret[res[i].column_name].format = "double";
          break;
        case "integer":
          /* http://www.postgresql.org/docs/9.1/static/datatype-numeric.html#DATATYPE-SERIAL */
          if (res[i].is_nullable === "NO" && res[i].column_default === "AUTO_INCREMENT") {
            ret[res[i].column_name].type = "integer";
            ret[res[i].column_name].format = "uint32";
            ret[res[i].column_name].minimum = "1";
            ret[res[i].column_name].maximum = "2147483647";
          } else {
            ret[res[i].column_name].type = "integer";
            ret[res[i].column_name].format = "int32";
            ret[res[i].column_name].minimum = "-2147483648";
            ret[res[i].column_name].maximum = "2147483647";
          }
          break;
        case "money":
          ret[res[i].column_name].type = "number";
          ret[res[i].column_name].format = "float";
          ret[res[i].column_name].minimum = "-92233720368547758.08";
          ret[res[i].column_name].maximum = "92233720368547758.07";
          break;
        case "serial":
          ret[res[i].column_name].type = "integer";
          ret[res[i].column_name].format = "uint32";
          ret[res[i].column_name].minimum = "1";
          ret[res[i].column_name].maximum = "2147483647";
          break;
        case "smallint":
          ret[res[i].column_name].type = "integer";
          ret[res[i].column_name].format = "int32";
          ret[res[i].column_name].minimum = "-32768";
          ret[res[i].column_name].maximum = "32767";
          break;
        case "text":
          ret[res[i].column_name].type = "string";
          break;
        case "time":
        case "time without time zone":
          ret[res[i].column_name].type = "string";
          ret[res[i].column_name].format = "time";
          break;
        case "timestamp":
        case "timestamp without time zone":
          ret[res[i].column_name].type = "string";
          ret[res[i].column_name].format = "date-time";
          break;
        case "time with time zone":
        case "timestamptz":
        case "timestamp with time zone":
          ret[res[i].column_name].type = "string";
          ret[res[i].column_name].format = "date-time";
          break;
        case "unknown":
        case "USER-DEFINED":
          ret[res[i].column_name].type = "string";
          break;
        default:
          throw new Error("Unsupported datatype format. No known conversion from PostgreSQL to JSON-Schema.");
          break;
      }
    }

    /* return the results */
    return ret;
  }

$$ );
