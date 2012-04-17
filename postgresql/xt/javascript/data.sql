select xt.install_js('XT','Data','xtuple', $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /**
    @class

    The XT.Data class includes all functions necessary to process data source requests against the database.
    It should be instantiated as an object against which its funtion calls are made. This class enforces privilege 
    control and as such is not and should not be dispatchable.
  */
  
  XT.Data = {

    ARRAY_TYPE: "A",
    COMPOSITE_TYPE: "C",
    DATE_TYPE: "D",
    STRING_TYPE: "S",
  
    CREATED_STATE: 'created',
    READ_STATE: "read",
    UPDATED_STATE: 'updated',
    DELETED_STATE: 'deleted',

    /** 
      Build a SQL clause based on privileges for name space and type, and conditions and parameters passed. Input 
      Conditions and parameters are presumed to conform to SproutCore's SC.Query syntax. 

      @seealso fetch
      @seealso http://sproutcore.com/docs/#doc=SC.Query

      @param {String} name space
      @param {String} type
      @param {Object} conditions - optional
      @param {Object} parameters - optional
      @returns {Boolean}
    */
    buildClause: function(nameSpace, type, conditions, parameters) {
      var ret = ' true ', cond = '', pcond = '',
          map = XT.Orm.fetch(nameSpace, type),
          privileges = map.privileges;
          
      /* handle passed conditions */
      if(conditions) {
        /* helper function */
        format = function(arg) { 
          var type = XT.typeOf(arg);
          if(type === 'string') return "'" + arg + "'"; 
          else if(type === 'array') return "array[" + arg + "]";   
          return arg;
        }      

        /* evaluate */
        if(parameters) {
          if(conditions.indexOf('%@') > 0) {  /* replace wild card tokens */
            for(var i = 0; i < parameters.length; i++) {
              var val =  format(parameters[i]);
              conditions = conditions.replace(/%@/,val);
            }
          } else {  /* replace parameterized tokens */
            for(var prop in parameters) {
              var param = '{' + prop + '}',
                  val = format(parameters[prop]),
                  regExp = new RegExp(param, "g"); 
              conditions = conditions.replace(regExp, val);
            }
          }
        }
      }

      /* handle privileges */
      if((privileges &&
         (!privileges.all || (privileges.all &&
         (!this.checkPrivilege(privileges.all.read) && 
          !this.checkPrivilege(privileges.all.update)))) &&
           privileges.personal &&
          (this.checkPrivilege(privileges.personal.read) || 
           this.checkPrivilege(privileges.personal.update)))) {
        var properties = privileges.personal.properties, conds = [], col;
        for(var i = 0; i < properties.length; i++) {
          col = map.properties.findProperty('name', properties[i]).toOne ? "(" + properties[i] + ").username" : properties[i];
          conds.push(col);
        }
        pcond = "'" + this.currentUser() + "' in (" + conds.join(",") + ")";
      }    
      ret = conditions && conditions.length ? '(' + conditions + ')' : ret;
      ret = pcond.length ? (conditions && conditions.length ? ret.concat(' and ', pcond) : pcond) : ret;
      return ret;
    },

    /**
      Queries whether the current user has been granted the privilege passed.

      @param {String} privilege
      @returns {Boolean}
    */
    checkPrivilege: function(privilege) {
      var ret = privilege;
      if (typeof privilege === 'string') {
        if(!this._grantedPrivs) this._grantedPrivs = [];
        if(this._grantedPrivs.contains(privilege)) return true;  
        var res = executeSql("select checkPrivilege($1) as is_granted", [ privilege ]),
          ret = res[0].is_granted;
        /* cache the result locally so we don't requery needlessly */
        if(ret) this._grantedPrivs.push(privilege);
      }
      return ret;
    },
  
    /**
      Validate whether user has read access to data. If a record is passed, check personal privileges of
      that record. 

      @param {String} name space
      @param {String} type name
      @param {Object} record - optional
      @param {Boolean} is top level, default is true
      @returns {Boolean}
    */
    checkPrivileges: function(nameSpace, type, record, isTopLevel) {
      var isTopLevel = isTopLevel !== false ? true : false,
          isGrantedAll = true,
          isGrantedPersonal = false,
          map = XT.Orm.fetch(nameSpace, type),
          privileges = map.privileges,
          committing = record ? record.dataState !== this.READ_STATE : false;
          action =  record && record.dataState === this.CREATED_STATE ? 'create' : 
                    record && record.dataState === this.DELETED_STATE ? 'delete' :
                    record && record.dataState === this.UPDATED_STATE ? 'update' : 'read';

      /* if there is no ORM, this isn't a table data type so no check required */
      if (DEBUG) print(NOTICE, 'orm is ->', JSON.stringify(map, null, 2));    
      if(!map) return true;
      
      /* can not access 'nested only' records directly */
      if(DEBUG) print(NOTICE, 'is top level ->', isTopLevel, 'is nested ->', map.isNestedOnly);    
      if(isTopLevel && map.isNestedOnly) return false
        
      /* check privileges - first do we have access to anything? */
      if(privileges) { 
        if(DEBUG) print(NOTICE, 'privileges found');      
        if(committing) {
          if(DEBUG) print(NOTICE, 'is committing');
          
          /* check if user has 'all' read privileges */
          isGrantedAll = privileges.all ? this.checkPrivilege(privileges.all[action]) : false;

          /* otherwise check for 'personal' read privileges */
          if(!isGrantedAll) isGrantedPersonal =  privileges.personal ? this.checkPrivilege(privileges.personal[action]) : false;
        } else {
          if(DEBUG) print(NOTICE, 'is NOT committing');
          
          /* check if user has 'all' read privileges */
          isGrantedAll = privileges.all ? 
                         this.checkPrivilege(privileges.all.read) || 
                         this.checkPrivilege(privileges.all.update) : false;

          /* otherwise check for 'personal' read privileges */
          if(!isGrantedAll) isGrantedPersonal =  privileges.personal ? 
                                                 this.checkPrivilege(privileges.personal.read) || 
                                                 this.checkPrivilege(privileges.personal.update) : false;
        }
      }
      
      /* if we're checknig an actual record and only have personal privileges, see if the record allows access */
      if(record && !isGrantedAll && isGrantedPersonal) {
        if(DEBUG) print(NOTICE, 'checking record level personal privileges');    
        var that = this,

        /* shared checker function that checks 'personal' properties for access rights */
        checkPersonal = function(record) {
          var i = 0, isGranted = false,
              props = privileges.personal.properties;
          while(!isGranted && i < props.length) {
            var prop = props[i];
            isGranted = record[prop] && record[prop].username === that.currentUser();
            i++;
          }
          return isGranted;
        }
        
        /* if committing we need to ensure the record in its previous state is editable by this user */
        if(committing && (action === 'update' || action === 'delete')) {
          var pkey = XT.Orm.primaryKey(map),
              old = this.retrieveRecord(nameSpace + '.' + type, record[pkey]);
          isGrantedPersonal = checkPersonal(old);
          
        /* ...otherwise check personal privileges on the record passed */
        } else if(action === 'read') {
          isGrantedPersonal = checkPersonal(record);
        }
      }
      if(DEBUG) print(NOTICE, 'is granted all ->', isGrantedAll, 'is granted personal ->', isGrantedPersonal);  
      return isGrantedAll || isGrantedPersonal;
    },
    
    /**
      Commit array columns with their own statements 
      
      @param {Object} record object to be committed
      @param {Object} view definition object
    */
    commitArrays: function(nameSpace, record, orm) {
      for(var prop in record) {
        var ormp = XT.Orm.getProperty(orm, prop);

        /* if the property is an array of objects they must be records so commit them */
        if (ormp.toMany && ormp.toMany.isNested) {
            var key = nameSpace.toUpperCase() + '.' + ormp.toMany.type,
                values = record[prop]; 
          for (var i = 0; i < values.length; i++) {
            this.commitRecord(key, values[i], false);
          }
        }
      }   
    },

    /**
      Commit metrics that have changed to the database.

      @param {Object} metrics
      @returns Boolean
    */
    commitMetrics: function(metrics) {
      for(var key in metrics) {
        var value = metrics[key];      
        if(typeof value === 'boolean') value = value ? 't' : 'f';
        else if(typeof value === 'number') value = value.toString();    
        executeSql('select setMetric($1,$2)', [key, value]);
      }
      return true;
    },

    /**
      Commit a record to the database 

      @param {String} name space qualified record type
      @param {Object} data object
    */
    commitRecord: function(key, value, encryptionKey) {
      var nameSpace = key.beforeDot().camelize().toUpperCase(),
          type = key.afterDot().classify();
      var hasAccess = this.checkPrivileges(nameSpace, type, value, false);
      if(!hasAccess) throw new Error("Access Denied.");    
      if(value && value.dataState) {
        if(value.dataState === this.CREATED_STATE) { 
          this.createRecord(key, value, encryptionKey);
        }
        else if(value.dataState === this.UPDATED_STATE) { 
          this.updateRecord(key, value, encryptionKey);
        }
        else if(value.dataState === this.DELETED_STATE) { 
          this.deleteRecord(key, value); 
        }
      }
    },

    /**
      Commit insert to the database 

      @param {String} name space qualified record type
      @param {Object} the record to be committed
    */
    createRecord: function(key, value, encryptionKey) {
      var viewName = key.afterDot().decamelize(), 
          schemaName = key.beforeDot().decamelize(),    
          orm = XT.Orm.fetch(key.beforeDot(), key.afterDot()),
          record = value,
          sql = '', columns, expressions,
          props = [], params = [];
      delete record['dataState'];
      delete record['type'];

      /* build up the content for insert of this record */
      for(var prop in record) {
        var ormp = XT.Orm.getProperty(orm, prop),
            type = ormp.attr ? ormp.attr.type : ormp.toOne ? ormp.toOne.type : ormp.toMany.type;
        if (!ormp.toMany) { 
          props.push('"' + prop + '"');

          /* handle encryption if applicable */
          if(ormp && ormp.attr && ormp.attr.isEncrypted) {
            if(encryptionKey) {
              record[prop] = "(select encrypt(setbytea('{value}'), setbytea('{encryptionKey}'), 'bf'))"
                             .replace(/{value}/, record[prop])
                             .replace(/{encryptionKey}/, encryptionKey);
              params.push(record[prop]);
            } else { 
              throw new Error("No encryption key provided.");
            }
          } else if(record[prop] !== null) { 
            if (ormp && ormp.toOne && ormp.toOne.isNested) { 
              if(record[prop] !== null) {
                var row = this.rowify(schemaName + '.' + ormp.toOne.type, record[prop]);
                params.push(row);
              } else {
                record[prop] = "null::" + schemaName + '.' + ormp.toOne.type;
              }
            } else if(type === 'String' || type === 'Date') { 
              params.push("'" + record[prop] + "'");
            } else {
              params.push(record[prop]);
            }
          } else {
            params.push('null');
          }
        }
      }
      columns = props.join(', ');
      expressions = params.join(', ');
      sql = 'insert into {recordType} ({columns}) values ({expressions})'
            .replace(/{recordType}/, key.decamelize())
            .replace(/{columns}/, columns)
            .replace(/{expressions}/, expressions)
      
      if(DEBUG) { print(NOTICE, 'sql =', sql); }
      
      /* commit the record */
      executeSql(sql); 

      /* okay, now lets handle arrays */
      this.commitArrays(schemaName, record, orm);
    },

    /**
      Commit update to the database 

      @param {String} name space qualified record type
      @param {Object} the record to be committed
    */
    updateRecord: function(key, value, encryptionKey) {
      var viewName = key.afterDot().decamelize(), 
          schemaName = key.beforeDot().decamelize(),
          orm = XT.Orm.fetch(key.beforeDot(),key.afterDot()),
          pkey = XT.Orm.primaryKey(orm),
          record = value,
          sql = '', expressions, params = [];
      delete record['dataState'];
      delete record['type'];

      /* build up the content for update of this record */
      for(var prop in record) {
        var ormp = XT.Orm.getProperty(orm, prop),
            type = ormp.attr ? ormp.attr.type : ormp.toOne ? ormp.toOne.type : ormp.toMany.type,
            qprop = '"' + prop + '"';

        /* handle encryption if applicable */
        if(ormp && ormp.attr && ormp.attr.isEncrypted) {
          if(encryptionKey) {
            record[prop] = "(select encrypt(setbytea('{value}'), setbytea('{encryptionKey}'), 'bf'))"
                           .replace(/{value}/, record[prop])
                           .replace(/{encryptionKey}/, encryptionKey);
            params.push(qprop.concat(" = ", record[prop]));
          } else {
            throw new Error("No encryption key provided.");
          }
        } else if (!ormp.toMany && ormp.name !== pkey) {
          if(record[prop] !== null) {
            if (ormp.toOne && ormp.toOne.isNested) {
              var row = this.rowify(schemaName + '.' + ormp.toOne.type, record[prop]);         
              params.push(qprop.concat(" = ", row));
            } else if (type === 'String' || type === 'Date') { 
              params.push(qprop.concat(" = '", record[prop], "'"));
            } else {
              params.push(qprop.concat(" = ", record[prop]));
            }
          } else {
            params.push(qprop.concat(' = null'));
          }
        }
      }

      expressions = params.join(', ');
      sql = 'update {recordType} set {expressions} where {primaryKey} = $1;'
            .replace(/{recordType}/, key.decamelize())
            .replace(/{expressions}/, expressions)
            .replace(/{primaryKey}/, pkey);    
      if(DEBUG) { print(NOTICE, 'sql =', sql); }
      
      /* commit the record */
      executeSql(sql, [record[pkey]]); 

      /* okay, now lets handle arrays */
      this.commitArrays(schemaName, record, orm); 
    },

    /**
      Commit deletion to the database 

      @param {String} name space qualified record type
      @param {Object} the record to be committed
    */
    deleteRecord: function(key, value) {
      var record = XT.decamelize(value), sql = '',
          orm = XT.Orm.fetch(key.beforeDot(),key.afterDot()),
          pkey = XT.Orm.primaryKey(orm);
      sql = 'delete from {recordType} where {primaryKey} = $1;'
            .replace(/{recordType}/, key.decamelize())
            .replace(/{primaryKey}/, pkey);     
      if(DEBUG) print(NOTICE, 'sql =', sql);
      
      /* commit the record */
      executeSql(sql, [record[pkey]]); 
    },

    /** 
      Returns the currently logged in user's username.
      
      @returns {String} 
    */
    currentUser: function() {
      var res;
      if(!this._currentUser) {
        res = executeSql("select getEffectiveXtUser() as curr_user");

        /* cache the result locally so we don't requery needlessly */
        this._currentUser = res[0].curr_user;
      }
      return this._currentUser;
    },

    /** 
      Decrypts properties where applicable.

      @param {String} name space
      @param {String} type
      @param {Object} record
      @param {Object} encryption key
      @returns {Object} 
    */
    decrypt: function(nameSpace, type, record, encryptionKey) {
      var orm = XT.Orm.fetch(nameSpace, type);
      for(var prop in record) {
        var ormp = XT.Orm.getProperty(orm, prop.camelize());

        /* decrypt property if applicable */
        if(ormp && ormp.attr && ormp.attr.isEncrypted) {
          if(encryptionKey) {
            sql = "select formatbytea(decrypt(setbytea($1), setbytea($2), 'bf')) as result";
            record[prop] = executeSql(sql, [record[prop], encryptionKey])[0].result;
          } else {
            record[prop] = '**********'
          }
            
        /* check recursively */
        } else if (ormp.toMany && ormp.toMany.isNested) {
          this.decrypt(nameSpace, ormp.toMany.type, record[prop][i]);
        }
      }
      return record;
    },

    /**
      Fetch an array of records from the database.

      @param {String} record type
      @param {Object} conditions
      @param {Object} parameters
      @param {String} order by - optional
      @param {Number} row limit - optional
      @param {Number} row offset - optional
      @returns Array
    */
    fetch: function(recordType, conditions, parameters, orderBy, rowLimit, rowOffset) {
      var nameSpace = recordType.beforeDot(),
          type = recordType.afterDot(),
          table = (nameSpace + '.' + type).decamelize(),
          orm = XT.Orm.fetch(nameSpace, type),
          orderBy = (orderBy ? 'order by ' + orderBy : ''),
          limit = rowLimit ? 'limit ' + rowLimit : '';
          offset = rowOffset ? 'offset ' + rowOffset : '',
          recs = null, 
          conditions = this.buildClause(nameSpace, type, conditions, parameters),
          sql = "select * from {table} where {conditions} {orderBy} {limit} {offset}";

      /* validate - don't bother running the query if the user has no privileges */
      if(!this.checkPrivileges(nameSpace, type)) throw new Error("Access Denied.");

      /* query the model */
      sql = sql.replace('{table}', table)
               .replace('{conditions}', conditions)
               .replace('{orderBy}', orderBy)
               .replace('{limit}', limit)
               .replace('{offset}', offset);     
      if(DEBUG) { print(NOTICE, 'sql = ', sql); }
      recs = executeSql(sql);
      for (var i = 0; i < recs.length; i++) {  	
        recs[i] = this.decrypt(nameSpace, type, recs[i]);	  	
      }
      return recs;
    },

    /**
      Retreives a single record from the database. If the user does not have appropriate privileges an
      error will be thrown.
      
      @param {String} namespace qualified record type
      @param {Number} record id
      @param {String} encryption key
      @returns Object
    */
    retrieveRecord: function(recordType, id, encryptionKey) {
      return this.retrieveRecords(recordType, [id], encryptionKey)[0];
    },

    /**
      Retreives an array of records from the database. If the user does not have appropriate privileges an
      error will be thrown.
      
      @param {String} namespace qualified record type
      @param {Number} record ids
      @param {String} encryption key
      @returns Object
    */
    retrieveRecords: function(recordType, ids, encryptionKey) {
      var nameSpace = recordType.beforeDot(), 
          type = recordType.afterDot(),
          map = XT.Orm.fetch(nameSpace, type),
          ret, sql, pkey = XT.Orm.primaryKey(map);
      if(!pkey) throw new Error('No primary key found for {recordType}'.replace(/{recordType}/, recordType));
      sql = "select * from {schema}.{table} where {primaryKey} in ({ids});"
            .replace(/{schema}/, nameSpace.decamelize())
            .replace(/{table}/, type.decamelize())
            .replace(/{primaryKey}/, pkey)
            .replace(/{ids}/, ids.join(','));

      /* validate - don't bother running the query if the user has no privileges */
      if(!this.checkPrivileges(nameSpace, type)) throw new Error("Access Denied.");

      /* query the map */
      if(DEBUG) print(NOTICE, 'sql = ', sql);
      ret = executeSql(sql);
      if(!ret.length) throw new Error('No record found for {recordType} id(s) {ids}'
                                      .replace(/{recordType}/, recordType)
                                      .replace(/{ids}/, ids.join(',')));

      for (var i = 0; i < ret.length; i++) {
        /* check privileges again, this time against record specific criteria where applicable */
        if(!this.checkPrivileges(nameSpace, type, ret[i])) throw new Error("Access Denied.");
        
        /* decrypt result where applicable */
        ret[i] = this.decrypt(nameSpace, type, ret[i], encryptionKey);
      }

      /* return the results */
      return ret;
    },

    /**
      Returns a array of key value pairs of metric settings that correspond with an array of passed keys.
      
      @param {Array} array of metric names
      @returns {Array} 
    */
    retrieveMetrics: function(keys) {
      var sql = 'select metric_name as setting, metric_value as value '
              + 'from metric '
              + 'where metric_name in ({keys})', ret; 
      for(var i = 0; i < keys.length; i++) keys[i] = "'" + keys[i] + "'";
      sql = sql.replace(/{keys}/, keys.join(','));
      ret =  executeSql(sql);

      /* recast where applicable */
      for(var i = 0; i < ret.length; i++) {
        if(ret[i].value === 't') ret[i].value = true;
        else if(ret[i].value === 'f') ret[i].value = false
        else if(!isNaN(ret[i].value)) ret[i].value = ret[i].value - 0;
      }
      return ret;
    },

    /** 
      Convert a record object to PostgresSQL row formatted string.

      @param {String} the column type
      @param {Object} data to convert
      @returns {String} a string formatted like a postgres RECORD datatype 
    */
    rowify: function(key, value) {
      var type = key.afterDot().classify(), 
          nameSpace = key.beforeDot().toUpperCase(),
          orm = XT.Orm.fetch(nameSpace, type),
          record = value,
          props = [], ret = '';

      for (var prop in record) {
        var ormp = XT.Orm.getProperty(orm, prop),
        type = ormp ? (ormp.attr ? ormp.attr.type : ormp.toOne ? ormp.toOne.type : ormp.toMany.type) : 'String';
        if (prop) {
          if (ormp.toMany) { 
            /* orm rules ignore arrays, but we need this place holder so type signatures match */
            props.push("'{}'");  
          } else if (ormp.toOne && ormp.toOne.isNested) { 
            record[prop] = this.rowify(nameSpace + '.' + type, record[prop]);
            props.push(record[prop]); 
          } else if (type === 'String' ||
                     type === 'Date') {
            props.push("'" + record[prop] + "'"); 
          } else {
            props.push(record[prop]);
          }
        } else {
          props.push('null');
        }
      }
      ret = ret.concat('(', props.join(','), ')');
      if(DEBUG) { print(NOTICE, 'rowify = ', ret); }    
      return ret;
    }
  }

$$ );

