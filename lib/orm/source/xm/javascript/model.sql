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

    /* if the model uses a natural key, get the primary key value */
    rec = data.retrieveRecord({
      nameSpace: nameSpace,
      type: type,
      id: id
    });
    pid = nkey ? data.getId(orm, id) : id;
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
        key = XT.Orm.naturalKey(map) || XT.Orm.primaryKey(map),
        sql = 'select "{key}" as id from {table} where "{userKey}"::text=$1::text and "{key}" != $2'
              .replace(/{key}/g, key)
              .replace(/{table}/, table)
              .replace(/{userKey}/, key)
              .replace(/{value}/, value)
              .replace(/{id}/, id),
        result;
        if (DEBUG) { plv8.elog(NOTICE, sql); }
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
      data = Object.create(XT.Data),
      nkey = XT.Orm.naturalKey(map),
      tableName = map.table,
      tableSuffix = tableName.indexOf('.') ? tableName.afterDot() : tableName,
      sql,
      fkeys,
      uses,
      i,
      attr,
      seq,
      tableName;

   if (nkey) { id = data.getId(map, id); }
      
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

