select xt.install_js('XT','Schema','xtuple', $$

(function () {

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
  XT.Schema.columnInfo = function(ormSchemaTable, ormColumns) {
    var colNames = "",
        schema,
        table,
        func,
        schemaTable,
        sql,
        fetchRes,
        fetchSql,
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
            'column_name, ' +
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
            'and column_name in (';

    /* Build column_name in (...) string. */
    for (var i = 0; i < ormColumns.length; i++) {
      if (i === 0) {
        colNames = colNames + "'" + ormColumns[i] + "'";
      } else {
        colNames = colNames + ", '" + ormColumns[i] + "'";
      }
    }

    /* TODO - $3 in sql doesn't work for column_name in (...). */
    sql = sql + colNames + ")";

    res = plv8.execute(sql, [schema, table]);

    if (!res.length) {
      return false;
    }

    for (var i = 0; i < res.length; i++) {
      ret[res[i].column_name] = {};

      /* Set "description" if column "comment" is not null. */
      if (res[i].comment) {
        ret[res[i].column_name].description = res[i].comment;
      }

      /* Set "required" if column is not "is_nullable". */
      if (res[i].is_nullable === "NO") {
        /* Check if this is a fetchable number. */
        fetchSql = 'select orderseq_id from orderseq where orderseq_table = $1 and orderseq_numcol = $2;';
        fetchRes = plv8.execute(fetchSql, [table, res[i].column_name]);

        /* Set to required when this is not a fetchable number. If it is fetchable, see xt.post(). */
        if (!fetchRes.length) {
          ret[res[i].column_name].required = true;
        }
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
        case "name":
          ret[res[i].column_name].type = "string";
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
        case "uuid":
          ret[res[i].column_name].type = "string";
          ret[res[i].column_name].format = "uuid";
          break;
        default:
          throw new Error("Unsupported datatype format. No known conversion from PostgreSQL to JSON-Schema.");
      }
    }

    /* return the results */
    return ret;
  };

  /**
   * Return a JSON-Schema for an ORM to be used for an API Discovery Service
   * resource's "properties".
   *
   * @param {Object} An ORM object or a basic one with just orm.nameSpace and orm.type.
   * @returns {Object}
   */
  XT.Schema.getProperties = function(orm) {
    /* Load ORM if this function was called with just orm.nameSpace and orm.type. */
    orm = orm.properties ? orm : XT.Orm.fetch(orm.nameSpace, orm.type, {"silentError": true});
    if (!orm || !orm.properties) {
      return false;
    }

    var attrPriv = orm.privileges && orm.privileges.attribute ? orm.privileges.attribute : false,
        attr,
        columns = [],
        ext = {},
        nkey = XT.Orm.naturalKey(orm),
        pkey = XT.Orm.primaryKey(orm),
        prop,
        ret = {"id": orm.type, "type": "object"},
        relatedORM = {},
        relatedKey,
        relatedKeyProp,
        schemaColumnInfo = {},
        schemaTable = orm.table;

    if (orm.extensions.length > 0) {
      /* Loop through the ORM extensions and add their properties into main properties. */
      for (var i = 0; i < orm.extensions.length; i++) {
        for (var j = 0; j < orm.extensions[i].properties.length; j++) {
          var propLength = orm.properties.length;

          orm.properties[propLength] = orm.extensions[i].properties[j];

          /* Set extTable property to be used to get extension table column properties. */
          if (orm.extensions[i].table !== schemaTable) {
            orm.properties[propLength].extTable = orm.extensions[i].table;
          }
        }
      }
    }

    /* Loop through the ORM properties and get the columns. */
    for (var i = 0; i < orm.properties.length; i++) {
      prop = orm.properties[i];
      attr = prop.attr;

      /* Skip primaryKey if there is a natualKey that's a different property. */
      if (nkey && orm.properties[i].name === pkey && orm.properties[i].name !== nkey) {
        continue;
      }

      /* Skip this property if it has a attr.value. Those are just used for relation associaiton queries. */
      if (orm.properties[i].attr && orm.properties[i].attr.value) {
        continue;
      }

      /* Skip this property if its ORM column priv is set to false. */
      /* TODO: Not checking for superuser here. This is more to just check if the column is set to false. */
      if (attrPriv && attrPriv[orm.properties[i].name] &&
        (attrPriv[orm.properties[i].name].view !== undefined) &&
        !XT.Data.checkPrivilege(attrPriv[orm.properties[i].name].view)) {
        continue;
      }

      if (!ret.properties) {
        /* Initialize properties. */
        ret.properties = {};
      }

      /* Add title and description properties. */
      /* For readability only, title should be first, therefore a redundant if. */
      if ((orm.properties[i].attr && orm.properties[i].attr.column) ||
        (orm.properties[i].toOne) ||
        (orm.properties[i].toMany)) {

        /* Initialize named properties. */
        ret.properties[orm.properties[i].name] = {};
        ret.properties[orm.properties[i].name].title = orm.properties[i].name.humanize();
      }

      /**
       * Derived property
       * By definition a derived property is not backed by a column, so use the
       * 'name' property to stand in for the column.
       */
      if (attr && attr.derived) {
        attr.column = prop.name;
      }

      /* Basic property */
      if (orm.properties[i].attr && orm.properties[i].attr.column) {
        if (orm.properties[i].extTable) {
          /* Build ext object to be used to get extension table column properties. */
          if (!ext[orm.properties[i].extTable]) {
            ext[orm.properties[i].extTable] = [];
          }
          ext[orm.properties[i].extTable].push(orm.properties[i].attr.column);
        } else {
          columns.push(orm.properties[i].attr.column);
        }

        /* Add required override based off of ORM's property. */
        if (orm.properties[i].attr.required) {
          /* Check if this is a fetchable number. */
          if (orm.orderSequence && orm.properties[i].name === nkey && nkey !== pkey) {
            /* Do not set this property to required. See xt.post() which will */
            /* use XM.Model.fetchNumber() for it. */
          } else {
            ret.properties[orm.properties[i].name].required = true;
          }
        }

        /* Add key flag. This isn't part of JSON-Schema, but very useful for URIs. */
        /* example.com/resource/{key} */
        /* JSON-Schema allows for additional custom properites like this. */
        if (nkey && orm.properties[i].name === nkey) {
          ret.properties[orm.properties[i].name].isKey = true;
        } else if (!nkey && orm.properties[i].name === pkey) {
          ret.properties[orm.properties[i].name].isKey = true;
        }
      }
      /* toOne property */
      else if (orm.properties[i].toOne) {
        if (orm.properties[i].toOne.isNested) {
          ret.properties[orm.properties[i].name].type = "object";
          ret.properties[orm.properties[i].name]["$ref"] = orm.properties[i].toOne.type;
        } else {

          relatedORM = XT.Orm.fetch(orm.nameSpace, orm.properties[i].toOne.type, {"silentError": true});
          relatedKey = XT.Orm.naturalKey(relatedORM) || XT.Orm.primaryKey(relatedORM);
          relatedKeyProp = XT.Orm.getProperty(relatedORM, relatedKey);

          if (relatedKeyProp && relatedKeyProp.attr && relatedKeyProp.attr.type) {
            ret.properties[orm.properties[i].name].type = relatedKeyProp.attr.type;
          } else {
            plv8.elog(ERROR, "No attr.type found for ORM: " + orm.properties[i].toOne.type);
          }

          /* This is an array of related keys, not a full object. */
          /* Make the $ref to the relation's natural key. */
          /* Using JSON-Schema $ref paths like this: */
          /* http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.7.2 */
          /* See also: http://www.sitepen.com/blog/2008/06/17/json-referencing-in-dojo/ */
          ret.properties[orm.properties[i].name]["$ref"] = orm.properties[i].toOne.type + "/" + relatedKey;
        }

        /* Add required override based off of ORM's property. */
        if (orm.properties[i].toOne.required) {
          ret.properties[orm.properties[i].name].required = true;
        }
      }
      /* toMany property */
      else if (orm.properties[i].toMany) {
        /* Add required override based off of ORM's property. */
        if (orm.properties[i].toMany.required) {
          ret.properties[orm.properties[i].name].required = true;
        }

        if (orm.properties[i].toMany.isNested) {
          ret.properties[orm.properties[i].name].type = "object";
          ret.properties[orm.properties[i].name].items = {"$ref": orm.properties[i].toMany.type};
        } else {
          /* TODO: Assuming "XM" here... */
          relatedORM = XT.Orm.fetch("XM", orm.properties[i].toMany.type, {"silentError": true});
          relatedKey = XT.Orm.naturalKey(relatedORM) || XT.Orm.primaryKey(relatedORM);

          ret.properties[orm.properties[i].name].type = "array";

          /* This is an array of related keys, not a full object. */
          /* Make the $ref to the relation's natural key. */
          /* Using JSON-Schema $ref paths like this: */
          /* http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.7.2 */
          /* See also: http://www.sitepen.com/blog/2008/06/17/json-referencing-in-dojo/ */
          ret.properties[orm.properties[i].name].items = {
            "$ref": orm.properties[i].toMany.type + "/" + relatedKey
          };
        }
      }
      /* Error */
      else {
        /* You broke it. We should not be here. */
        throw new Error("Invalid ORM property. Unable to generate JSON-Schema from this ORM.");
      }
    }

    /* Assign column attributes. */
    schemaColumnInfo = XT.Schema.columnInfo(schemaTable, columns);

    /* Add in extension table column properties. */
    for (var tableName in ext) {
      schemaColumnInfo = XT.extend(schemaColumnInfo, XT.Schema.columnInfo(tableName, ext[tableName]));
    }

    for (var i = 0; i < orm.properties.length; i++) {
      /* Basic properties only. */
      if (orm.properties[i].attr && orm.properties[i].attr.column) {
        /* Loop through the returned schemaColumnInfo attributes and add them. */
        for (var attrname in schemaColumnInfo[orm.properties[i].attr.column]) {
          if (!ret.properties[orm.properties[i].name]) {
            /* This can happen if the same column name is errantly referenced in different properties */
            throw new Error("Cannot get property " + orm.properties[i].name + " on ORM " + orm.nameSpace + "." + orm.type);
          }
          ret.properties[orm.properties[i].name][attrname] = schemaColumnInfo[orm.properties[i].attr.column][attrname];
        }
      }
    }

    /* If this ORM has no column properties, we have an empty object, return false. */
    if (!ret.properties || !Object.keys(ret.properties).length > 0) {
      return false;
    }

    /* return the results */
    return ret;
  };

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
        columns = [],
        schemaColumnInfo = {},
        ret = [];

    if (!orm.properties) {
      return false;
    }

    /* Loop through the ORM properties and get the columns. */
    for (var i = 0; i < orm.properties.length; i++) {

      /* Basic property */
      if (orm.properties[i].attr && orm.properties[i].attr.column) {
        columns.push(orm.properties[i].attr.column);

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

    /* Get required from the returned schemaColumnInfo properties. */
    schemaColumnInfo = XT.Schema.columnInfo(schemaTable, columns);

    for (var i = 0; i < orm.properties.length; i++) {
      /* Basic properties only. */
      if (orm.properties[i].attr && orm.properties[i].attr.column) {
        /* Get required from the returned schemaColumnInfo attributes. */
        if (schemaColumnInfo[orm.properties[i].attr.column].required) {
          ret.push(orm.properties[i].name);
        }
      }
    }

    /* If this ORM has no column properties, we have an empty object, return false. */
    if (!ret.length > 0) {
      return false;
    }

    /* return the results */
    return ret;
  };

}());

$$ );
