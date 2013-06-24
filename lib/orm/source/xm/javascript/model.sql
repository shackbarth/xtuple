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
      id: id
    });

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

    /* isNested toMany relationships are irrelevant and should be counted */
    for (fkIndex = fkeys.length - 1; fkIndex >= 0; fkIndex-=1) {
      /* loop backwards because we might be deleting elements of the array */
      fkey = fkeys[fkIndex];
      for(propIndex = 0; propIndex < map.properties.length; propIndex++) {
        propObj = map.properties[propIndex]; /* pining for underscore */
        if(propObj.toMany && propObj.toMany.isNested) {
          /* this fk is irrelevant and should not be counted against used */
          fkeys.splice(fkIndex, 1);
          break;
        }
      }
    }

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
$$ );

