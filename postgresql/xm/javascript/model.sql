select xt.install_js('XM','Model','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XM.Model = {};
  
  XM.Model.isDispatchable = true;

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

    return seq ? plv8.execute(sql, [seq])[0].result : false;
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
        pKey = XT.Orm.primaryKey(map),
        sql = 'select {primaryKey} as id from {table} where {userKey}::text=$1::text and {primaryKey} != $2'
              .replace(/{primaryKey}/g, pKey)
              .replace(/{table}/, table)
              .replace(/{userKey}/, key)
              .replace(/{value}/, value)
              .replace(/{id}/, id),
        result = plv8.execute(sql, [value, id])[0];

    return result ? result.id : 0;
  }

  /**
    Return whether a model is referenced by another table.
  */
  XM.Model.used = function(recordType, id) {
    var nameSpace = recordType.beforeDot(),
      type = recordType.afterDot(),
      map = XT.Orm.fetch(nameSpace, type),
      sql,
      fkeys,
      uses,
      i,
      attr,
      seq,
      tableName;
      
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
    fkeys = plv8.execute(sql, [map.table]);
    if (DEBUG) { plv8.elog(NOTICE, 'keys:' ,fkeys.length) }
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
      if (DEBUG) { plv8.elog(NOTICE, 'vars:', classId, seq, tableName) }
      attr = plv8.execute(sql, [classId, seq])[0].attname;

      /* See if there are dependencies */
      sql = 'select * from ' + tableName + ' where ' + attr + ' = $1 limit 1;'
      uses = plv8.execute(sql, [id]);
      if (uses.length) { return true; }
    }

    return false
  }
  
$$ );

