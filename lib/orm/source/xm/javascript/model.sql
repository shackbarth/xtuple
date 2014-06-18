select xt.install_js('XM','Model','xtuple', $$
  /* Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple.
     See www.xm.ple.com/CPAL for the full text of the software license. */

  if (!XM.Model) { XM.Model = {}; }

  XM.Model.isDispatchable = true;

  if (!XM.PrivateModel)  { XM.PrivateModel = {}; }
  XM.PrivateModel.isDispatchable = false;

  /**
    Pass in a record type and get the next id for that type

    @param {String} record type
    @returns Number
  */
  XM.Model.fetchId = function(recordType) {
    var nameSpace = recordType.beforeDot(),
        type = recordType.afterDot(),
        map = XT.Orm.fetch(nameSpace, type),
        seq = map.idSequenceName,
        sql = 'select nextval($1) as result';

    return seq ? plv8.execute(sql, [seq])[0].result : false;
  }

  /**
    Pass in a record type and get the next id for that type

    @param {String} record type
    @returns Number
  */
  XM.Model.fetchNumber = function(recordType) {
    var nameSpace = recordType.beforeDot(),
        type = recordType.afterDot(),
        map = XT.Orm.fetch(nameSpace, type),
        seq = map.orderSequence,
        sql = 'select fetchNextNumber($1) as result';

    /**  if the order sequence name in orderseq is not found in the ORM
      throw an error */
    if (seq) {
      return plv8.execute(sql, [seq])[0].result;
    } else {
      plv8.elog(ERROR, "orderSequence is not defined in the ORM");
    }
  },

  /**
    Obtain a pessemistic record lock. Defaults to timeout of 30 seconds.

    @param {String} Namespace
    @param {String} Type
    @param {String|Number} Id
    @param {String} etag
    @param {Object} Options: timeout
  */
  XM.Model.obtainLock = function (nameSpace, type, id, etag, options) {
    var orm = XT.Orm.fetch(nameSpace, type),
       data = Object.create(XT.Data),
       lockTable = orm.lockTable || orm.table,
       pkey = XT.Orm.primaryKey(orm),
       nkey = XT.Orm.naturalKey(orm),
       rec,
       pid;

    /* If the model uses a natural key, get the primary key value. */
    rec = data.retrieveRecord({
      nameSpace: nameSpace,
      type: type,
      id: id,
      silentError: true
    });

    if (!rec) { return false; }

    pid = nkey ? data.getId(orm, id) : id;
    if (!pid) {
// TODO - Send not found message back.
      return false;
    }

    if (!rec || !rec.data) { throw "Record for requested lock not found." }
    if (rec.etag !== etag) { return false; }

    return data.tryLock(lockTable, pid);
  }

  /**
    Renew a record lock. Defaults to timeout of 30 seconds.

    @param {Number} Key
    @param {Object} Options: timeout
  */
  XM.Model.renewLock = function (key, options) {
    return XT.Data.renewLock(key, options);
  }

  /**
    Release a record lock.

    @param {Number} key
  */
  XM.Model.releaseLock = function (key) {
    return XT.Data.releaseLock(key);
  }

  /**
    Release a number back into the sequence pool for a given type.

    @param {String} record type
    @param {Number} number
    @returns Boolean
  */
  XM.Model.releaseNumber = function(recordType, number) {
    var nameSpace = recordType.beforeDot(),
        type = recordType.afterDot(),
        map = XT.Orm.fetch(nameSpace, type),
        seq = map.orderSequence,
        sql = 'select releaseNumber($1, $2) as result';

    return seq ? plv8.execute(sql, [seq, number - 0])[0].result > 0 : false;
  }

  /**
    Return a matching record id for a passed user key and value. If none found returns zero.

    @param {String} record type
    @param {String} user key
    @param {Number} value
    @returns Number
  */
  XM.Model.findExisting = function(recordType, key, value, id) {
    var nameSpace = recordType.beforeDot(),
        type = recordType.afterDot(),
        map = XT.Orm.fetch(nameSpace, type),
        table = recordType.decamelize(),
        okey = XT.Orm.naturalKey(map) || XT.Orm.primaryKey(map),
        sql = 'select "{key}" as id from {table} where "{userKey}"::text=$1::text'
              .replace(/{key}/, okey)
              .replace(/{table}/, table)
              .replace(/{userKey}/, key),
        result;
        if (id) {
          sql += " and " + okey + " != $2";
          if (DEBUG) { XT.debug('XM.Model.findExisting sql = ', sql); }
          result = plv8.execute(sql, [value, id])[0];
        } else {
          if (DEBUG) { XT.debug('XM.Model.findExisting sql = ', sql); }
          result = plv8.execute(sql, [value])[0];
        }

    return result ? result.id : 0;
  };

  /**
   Returns a complex query's results.
   Sample usage:
    select xt.post('{
      "username": "admin",
      "nameSpace": "XM",
      "type": "Model",
      "dispatch":{
        "functionName":"query",
        "parameters":[
          "Address", {"query": {"parameters": [{"attribute": "city","operator": "=","value": "Norfolk"}]}}
        ]
      }
    }');

   @param {String} recordType to query
   @param {Object} options: query
   @returns Object
  */
  XM.Model.query = function (recordType, options) {
    options = options || {};
    var query = {};

    if (recordType && options && options.query) {
      query.username = XT.username;
      query.nameSpace = 'XM';
      query.type = recordType;
      query.query = options.query;
    }

    result = XT.Rest.get(query);

    return result;
  };
  XM.Model.query.scope = "Model";
  XM.Model.query.description = "Perform an complex query on a resource. This allows you to use a POST body for the query vs. a long URL.";
  XM.Model.query.request = {
    "$ref": "Query"
  };
  XM.Model.query.parameterOrder = ["recordType", "options"];
  // For JSON-Schema deff, see:
  // https://github.com/fge/json-schema-validator/issues/46#issuecomment-14681103
  XM.Model.query.schema = {
    Query: {
      properties: {
        attributes: {
          title: "Service request attributes",
          description: "An array of attributes needed to perform a complex query.",
          type: "array",
          items: [
            {
              title: "Resource",
              description: "The resource to query.",
              type: "string",
              required: true
            },
            {
              title: "Options",
              type: "object",
              "$ref": "QueryOptions"
            }
          ],
          "minItems": 2,
          "maxItems": 2,
          required: true
        }
      }
    },
    QueryOptions: {
      properties: {
        query: {
          title: "query",
          description: "The query to perform.",
          type: "object",
          "$ref": "QueryOptionsQuery"
        }
      }
    },
    QueryOptionsQuery: {
      properties: {
        parameters: {
          title: "Parameters",
          description: "The query parameters.",
          type: "array",
          items: [
            {
              title: "Attribute",
              type: "object",
              "$ref": "QueryOptionsParameters"
            }
          ],
          "minItems": 1
        },
        orderBy: {
          title: "Order By",
          description: "The query order by.",
          type: "array",
          items: [
            {
              title: "Attribute",
              type: "object",
              "$ref": "QueryOptionsOrderBy"
            }
          ]
        },
        rowlimit: {
          title: "Row Limit",
          description: "The query for paged results.",
          type: "integer"
        },
        maxresults: {
          title: "Max Results",
          description: "The query limit for total results.",
          type: "integer"
        },
        pagetoken: {
          title: "Page Token",
          description: "The query offset page token.",
          type: "integer"
        },
        count: {
          title: "Count",
          description: "Set to true to return only the count of results for this query.",
          type: "boolean"
        }
      }
    },
    QueryOptionsParameters: {
      properties: {
        attribute: {
          title: "Attribute",
          description: "The column name used to construct the query's WHERE clasues.",
          type: "string",
          required: true
        },
        operator: {
          title: "Operator",
          description: "The operator used to construct the query's WHERE clasues.",
          type: "string"
        },
        value: {
          title: "Value",
          description: "The value used to construct the query's WHERE clasues.",
          required: true
        }
      }
    },
    QueryOptionsOrderBy: {
      properties: {
        attribute: {
          title: "Attribute",
          description: "The column name used to construct the query's ORDER BY.",
          type: "string",
          required: true
        },
        descending: {
          title: "Direction",
          description: "Set to true so the query's ORDER BY will be DESC.",
          type: "boolean"
        }
      }
    }
  };

  /**
   Format acomplex query's using the REST query structure into an xTuple's query.
   This is a helper function that reformats the query structure from a
   rest_query to our XT.Rest structure. This function should be used by reformat
   any REST API client queriers.

   Sample usage:
    XM.Model.restQueryFormat("XM.Address", {"query": [{"city":{"EQUALS":"Norfolk"}}], "orderby": [{"ASC": "line1"}, {"DESC": "line2"}]})

   @param {Object} options: query
   @returns {Object} The formated query
  */
  XM.Model.restQueryFormat = function (recordType, options) {
    options = options || {};

    var order = {},
        param = {},
        query = {},
        mapOperator = function (op) {
          var operators = {
                value: {
                  ANY:          'ANY',
                  NOT_ANY:      'NOT ANY',
                  EQUALS:       '=',
                  NOT_EQUALS:   '!=',
                  LESS_THAN:    '<',
                  AT_MOST:      '<=',
                  GREATER_THAN: '>',
                  AT_LEAST:     '>=',
                  MATCHES:      'MATCHES',
                  BEGINS_WITH:  'BEGINS_WITH'
                }
              };

          return operators.value[op];
        };

    /* Convert from rest_query to XM.Model.query structure. */
    if (options) {
      if (options.query) {
        query.parameters = [];
        for (var i = 0; i < options.query.length; i++) {
          for (var column in options.query[i]) {
            for (var op in options.query[i][column]) {
              param = {};
              param.attribute = column;
              param.operator = mapOperator(op);
              param.value = options.query[i][column][op];
              query.parameters.push(param);
            }
          }
        }
      }

      /* Convert free text query. */
      if (recordType && options.q) {
        /* Get schema and add string columns to search query. */
        var data = Object.create(XT.Data),
          nameSpace = recordType.beforeDot(),
          type = recordType.afterDot(),
          orm = data.fetchOrm(nameSpace, type),
          schema = XT.Session.schema(nameSpace.decamelize(), type.decamelize()),
          param = {
            "attribute": []
          };

        for (var c = 0; c < schema[type].columns.length; c++) {
          if (schema[type].columns[c].category === 'S') {
            param.attribute.push(schema[type].columns[c].name);
          }
        }

        if (param.attribute.length) {
          /* Add all string columns to attribute query. */
          query.parameters = query.parameters || [];

          param.operator = 'MATCHES';

          /* Replace any spaces with regex '.*' so multi-word search works on similar strings. */
          param.value = options.q.replace(' ', '.*');
          query.parameters.push(param);
        }
      }

      if (options.orderby || options.orderBy) {
        options.orderBy = options.orderby || options.orderBy;
        query.orderBy = [];
        for (var o = 0; o < options.orderBy.length; o++) {
          for (var column in options.orderBy[o]) {
            order = {};
            order.attribute = column;
            if (options.orderBy[o][column] === 'DESC') {
              order.descending = true;
            }
            query.orderBy.push(order);
          }
        }
      }

      if (options.rowlimit || options.rowLimit) {
        options.rowLimit = options.rowlimit || options.rowLimit;
        query.rowLimit = options.rowLimit;
      }

      if (options.maxresults || options.maxResults) {
        options.maxResults = options.maxresults || options.maxResults;
        query.rowLimit = options.maxResults;
      }

      if (options.pagetoken || options.pageToken) {
        options.pageToken = options.pagetoken || options.pageToken;
        if (query.rowLimit) {
          query.rowOffset = (options.pageToken || 0) * (query.rowLimit);
        } else {
          query.rowOffset = (options.pageToken || 0);
        }
      }

      if (options.count) {
        query.count = options.count;
      }
    }

    return query;
  };

  /**
   Returns a complex query's results using the REST query structure. This is a
   wrapper for XM.Model.query that reformats the query structure from a
   rest_query to our XT.Rest structure. This dispatch function can be used by
   a REST API client to query a resource when the query would be too long to
   pass to the API as a GET URL query.

   Sample usage:
    select xt.post('{
      "username": "admin",
      "nameSpace": "XM",
      "type": "Model",
      "dispatch":{
        "functionName":"restQuery",
        "parameters":["Address", {"query": [{"city":{"EQUALS":"Norfolk"}}], "orderby": [{"ASC": "line1"}, {"DESC": "line2"}]}]
      }
    }');

   @param {String} recordType to query
   @param {Object} options: query
   @returns Object
  */
  XM.Model.restQuery = function (recordType, options) {
    options = options || {};
    var formattedOptions = {};

    /* Convert from rest_query to XM.Model.query structure. */
    if (recordType && options) {
      formattedOptions = {
        "query": XM.Model.restQueryFormat(recordType, options)
      };
    }

    result = XM.Model.query(recordType, formattedOptions);

    return result;
  };
  XM.Model.restQuery.description = "Perform an complex query on a resource using the REST query structure. This allows you to use a POST body for the query vs. a long URL.";
  XM.Model.restQuery.request = {
    "$ref": "RestQuery"
  };
  XM.Model.restQuery.parameterOrder = ["recordType", "options"];
  // For JSON-Schema deff, see:
  // https://github.com/fge/json-schema-validator/issues/46#issuecomment-14681103
  XM.Model.restQuery.schema = {
    RestQuery: {
      properties: {
        attributes: {
          title: "Service request attributes",
          description: "An array of attributes needed to perform a complex query.",
          type: "array",
          items: [
            {
              title: "Resource",
              description: "The resource to query.",
              type: "string",
              required: true
            },
            {
              title: "Options",
              type: "object",
              "$ref": "RestQueryOptions"
            }
          ],
          "minItems": 2,
          "maxItems": 2,
          required: true
        }
      }
    },
    RestQueryOptions: {
      properties: {
        query: {
          title: "query",
          description: "The query to perform.",
          type: "array",
          items: [
            {
              title: "column",
              type: "object"
            }
          ],
          "minItems": 1
        },
        orderby: {
          title: "Order By",
          description: "The query order by.",
          type: "array",
          items: [
            {
              title: "column",
              type: "object"
            }
          ]
        },
        rowlimit: {
          title: "Row Limit",
          description: "The query for paged results.",
          type: "integer"
        },
        maxresults: {
          title: "Max Results",
          description: "The query limit for total results.",
          type: "integer"
        },
        pagetoken: {
          title: "Page Token",
          description: "The query offset page token.",
          type: "integer"
        },
        count: {
          title: "Count",
          description: "Set to true to return only the count of results for this query.",
          type: "boolean"
        }
      }
    }
  };

  /**
    Used to determine whether a model is used or not.

    @param {String} Record Type
    @param {String|Number} Id
    @param {Array} Array of schema qualified foreign key table names that are exceptions
    @private
  */
  XM.PrivateModel.used = function(recordType, id, exceptions) {
      exceptions = exceptions || [];
      var nameSpace = recordType.beforeDot(),
      type = recordType.afterDot(),
      map = XT.Orm.fetch(nameSpace, type),
      data = Object.create(XT.Data),
      nkey = XT.Orm.naturalKey(map),
      tableName = map.lockTable || map.table,
      tableSuffix = tableName.indexOf('.') ? tableName.afterDot() : tableName,
      sql,
      fkeys,
      uses,
      i,
      attr,
      seq,
      tableName,
      fkIndex,
      fkey,
      propIndex,
      probObj;

    if (nkey) {
      id = data.getId(map, id);
      if (!id) {
        /* Throw an error here because returning false is a valid use case. */
        plv8.elog(ERROR, "Can not find primary key.");
      }
    }

    /* Determine where this record is used by analyzing foreign key linkages */
    sql = "select pg_namespace.nspname AS schemaname, " +
          "con.relname AS tablename, " +
          "conkey AS seq, " +
          "conrelid AS class_id " +
          "from pg_constraint, pg_class f, pg_class con, pg_namespace " +
          "where confrelid=f.oid " +
          "and conrelid=con.oid " +
          "and f.relname = $1 " +
          "and con.relnamespace=pg_namespace.oid; "
    fkeys = plv8.execute(sql, [tableSuffix]);

    /* isNested toMany relationships are irrelevant and should not be counted */
    /* First boil down our list of isNested toManys from the orm */
    var toMany = map.properties.filter(function (prop) {
      return prop.toMany && prop.toMany.isNested;
    }).map(function (prop) {
      var toManyType = prop.toMany.type,
        toManyMap = XT.Orm.fetch(nameSpace, toManyType)
        toManyTable = toManyMap.lockTable || toManyMap.table,
        toManyPrefix = toManyTable.indexOf('.') < 0 ? "public" : toManyTable.beforeDot(),
        toManySuffix = toManyTable.afterDot();

      return {nameSpace: toManyPrefix, tableName: toManySuffix};
    });

    if (DEBUG) { XT.debug('XM.Model.used toMany relations are:', JSON.stringify(toMany)); }

    for (fkIndex = fkeys.length - 1; fkIndex >= 0; fkIndex-=1) {
      /* loop backwards because we might be deleting elements of the array */
      fkey = fkeys[fkIndex];
      toMany.map(function (prop) {
        if (fkey.schemaname === prop.nameSpace && fkey.tablename === prop.tableName) {
          fkeys.splice(fkIndex, 1);
        }
      });
    }

    /* Remove exceptions */
    fkeys = fkeys.filter(function (key) {
      var name = key.schemaname + '.' + key.tablename;
      return !exceptions.contains(name);
    });

    if (DEBUG) { XT.debug('XM.Model.used keys length:', fkeys.length) }
    if (DEBUG) { XT.debug('XM.Model.used keys:', JSON.stringify(fkeys)) }

    for (i = 0; i < fkeys.length; i++) {
      /* Validate */

      sql = "select attname " +
            "from pg_attribute, pg_class " +
            "where ((attrelid=pg_class.oid) " +
            " and (pg_class.oid = $1) " +
            " and (attnum = $2)); ";

      classId = fkeys[i].class_id;
      seq =  fkeys[i].seq[0];
      tableName = fkeys[i].schemaname + '.' + fkeys[i].tablename;
      if (DEBUG) { XT.debug('XM.Model.used vars:', [classId, seq, tableName]) }
      attr = plv8.execute(sql, [classId, seq])[0].attname;

      /* See if there are dependencies */
      sql = 'select * from ' + tableName + ' where ' + attr + ' = $1 limit 1;'
      uses = plv8.execute(sql, [id]);
      if (uses.length) { return true; }
    }

    return false
  }

  /**
    Return whether a model is referenced by another table.
  */
  XM.Model.used = function(recordType, id) {
    return XM.PrivateModel.used(recordType, id);
  };

$$ );
