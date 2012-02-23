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
    COMPOUND_TYPE: "C",
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
          map = XT.getORM(nameSpace, type),
          privileges = map.privileges;

      /* handle passed conditions */
      if(conditions) {
        /* replace special operators */
        cond = conditions.replace('BEGINS_WITH','~^')
                         .replace('ENDS_WITH','~?')
                         .replace('CONTAINS','~')
                         .replace('MATCHES','~')
                         .replace('ANY', '<@ array')
                         .decamelize();

        quoteIfString = function(arg) { 
          if(typeof arg === 'string') { 
            return "'" + arg + "'"; 
          }

          return arg;
        }
        
        if(parameters) {
          if(cond.indexOf('%@') > 0) {  /* replace wild card tokens */
            for(var i = 0; i < parameters.length; i++) {
              var n = cond.indexOf('%@'),
                  val =  quoteIfString(parameters[i]);

              cond = cond.replace(/%@/,val);
            }
          } else {  /* replace parameterized tokens */
            for(var prop in parameters) {
              var param = '{' + prop.decamelize() + '}',
                  val = quoteIfString(parameters[prop]);
              
              cond = cond.replace(param, val);
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
      
      ret = cond.length ? '(' + cond + ')' : ret;
      ret = pcond.length ? (cond.length ? ret.concat(' and ', pcond) : pcond) : ret;

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
          map = XT.getORM(nameSpace, type),
          privileges = map.privileges,
          committing = record ? record.dataState !== this.READ_STATE : false;
          action =  record && record.dataState === this.CREATED_STATE ? 'create' : 
                    record && record.dataState === this.DELETED_STATE ? 'delete' :
                    record && record.dataState === this.UPDATED_STATE ? 'update' : 'read';

      /* can not access 'nested only' records directly */
      if(isTopLevel && map.isNestedOnly) return false
        
      /* check privileges - first do we have access to anything? */
      if(privileges) { 
        if(committing) {
          /* check if user has 'all' read privileges */
          isGrantedAll = privileges.all ? this.checkPrivilege(privileges.all[action]) : false;

          /* otherwise check for 'personal' read privileges */
          if(!isGrantedAll) isGrantedPersonal =  privileges.personal ? this.checkPrivilege(privileges.personal[action]) : false;
        } else {
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
        var that = this,

        /* shared checker function that checks 'personal' properties for access rights */
        checkPersonal = function(record) {
          var i = 0, isGranted = false,
              props = privileges.personal.properties;

          while(!isGranted && i < props.length) {
            var prop = props[i];
            isGranted = record[prop].username === that.currentUser();
            i++;
          }

          return isGranted;
        }
        
        /* if committing we need to ensure the record in its previous state is editable by this user */
        if(committing && (action === 'update' || action === 'delete')) {
          var pkey = XT.getPrimaryKey(map),
              old = this.retrieveRecord(nameSpace + '.' + type, record[pkey]);

          isGrantedPersonal = checkPersonal(old);
        /* ...otherwise check personal privileges on the record passed */
        } else if(action === 'read') {
          isGrantedPersonal = checkPersonal(record);
        }
      }
    
      return isGrantedAll || isGrantedPersonal;
    },
    
    /**
    Commit array columns with their own statements 
    
    @param {Object} record object to be committed
    @param {Object} view definition object
    */
    commitArrays: function(nameSpace, record, viewdef) {
      for(var prop in record) {
        var coldef = viewdef.findProperty('attname', prop);

        /* if the property is an array of objects they must be records so commit them */
        if (record[prop] instanceof Array && 
            record[prop].length &&
            isNaN(record[prop][0])) {
            var key = nameSpace.toUpperCase() + '.' + coldef['typname'].substring(1).classify(); /* strip underscore from (array) type name */
                values = record[prop]; 

          for(var i in values) {
            this.commitRecord(key, values[i], false);
          }
        }
      }   
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
          viewdef = XT.getViewDefinition(viewName, schemaName),
          orm = XT.getORM(key.beforeDot(), key.afterDot()),
          record = XT.decamelize(value),
          sql = '', columns, expressions,
          props = [], params = [];

      delete record['data_state'];
      delete record['type'];

      /* build up the content for insert of this record */
      for(var prop in record) {
        var coldef = viewdef.findProperty('attname', prop),
            ormp = XT.getProperty(orm, prop.camelize());

        if (coldef.typcategory !== this.ARRAY_TYPE) { 
          props.push(prop);

          if(typeof record[prop] !== undefined) { 
                  /* handle encryption if applicable */
            if(ormp && ormp.attr && ormp.attr.isEncrypted) {
              if(encryptionKey) {
                record[prop] = "(select encrypt(setbytea('{value}'), setbytea('{encryptionKey}'), 'bf'))"
                                .replace(/{value}/, record[prop])
                                .replace(/{encryptionKey}/, encryptionKey);
                
              } else { 
                throw new Error("No encryption key provided.");
              }
            } else if (coldef.typcategory === this.COMPOUND_TYPE) { 
              if(record[prop] !== null) {
                var row = this.rowify(schemaName + '.' + coldef.typname, record[prop]);

                record[prop] = row;
              } else {
                record[prop] = "null::" + schemaName + '.' + coldef.typname;
              }
            } 
            
            if(coldef.typcategory === this.STRING_TYPE ||
               coldef.typcategory === this.DATE_TYPE) { 
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
      this.commitArrays(schemaName, record, viewdef);
    },

    /**
    Commit update to the database 

    @param {String} name space qualified record type
    @param {Object} the record to be committed
    */
    updateRecord: function(key, value, encryptionKey) {
      var viewName = key.afterDot().decamelize(), 
          schemaName = key.beforeDot().decamelize(),
          viewdef = XT.getViewDefinition(viewName, schemaName),
          orm = XT.getORM(key.beforeDot(),key.afterDot()),
          pkey = XT.getPrimaryKey(orm),
          record = XT.decamelize(value),
          sql = '', expressions, params = [];

      delete record['data_state'];
      delete record['type'];

      /* build up the content for update of this record */
      for(var prop in record) {
        var coldef = viewdef.findProperty('attname', prop),
            ormp = XT.getProperty(orm, prop.camelize());

        /* handle encryption if applicable */
        if(ormp && ormp.attr && ormp.attr.isEncrypted) {
          if(encryptionKey) {
            record[prop] = "(select encrypt(setbytea('{value}'), setbytea('{encryptionKey}'), 'bf'))"
                           .replace(/{value}/, record[prop])
                           .replace(/{encryptionKey}/, encryptionKey);

            params.push(prop.concat(" = ", record[prop]));
          } else {
            throw new Error("No encryption key provided.");
          }
        } else if (coldef.typcategory !== this.ARRAY_TYPE) {
          if(typeof record[prop] !== 'undefined') { 
            if (coldef.typcategory === this.COMPOUND_TYPE) {
              if(record[prop] !== null) {
                var row = this.rowify(schemaName + '.' + coldef.typname, record[prop]);
              
                record[prop] = row;
              } else {
                record[prop] = "null::" + schemaName + '.' + coldef.typname;
              }
            } 
          
            if(coldef.typcategory === this.STRING_TYPE ||
               coldef.typcategory === this.DATE_TYPE) { 
              params.push(prop.concat(" = '", record[prop], "'"));
            } else {
              params.push(prop.concat(" = ", record[prop]));
            }
          } else {
            params.push(prop.concat(' = null'));
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
      this.commitArrays(schemaName, record, viewdef); 
    },

    /**
    Commit deletion to the database 

    @param {String} name space qualified record type
    @param {Object} the record to be committed
    */
    deleteRecord: function(key, value) {
      var record = XT.decamelize(value), sql = '',
          orm = XT.getORM(key.beforeDot(),key.afterDot()),
          pkey = XT.getPrimaryKey(orm);

      sql = 'delete from {recordType} where {primaryKey} = $1;'
            .replace(/{recordType}/, key.decamelize())
            .replace(/{primaryKey}/, pkey);
      
      if(DEBUG) { print(NOTICE, 'sql =', sql); }
      
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
    Adds 'type' and 'dataState' properties and camelizes record property names.

    @param {String} name space
    @param {String} type
    @param {Object} the record to be normalized
    @param {Object} view definition object
    @returns {Object} 
    */
    normalize: function(nameSpace, type, record, encryptionKey) {
      var schemaName = nameSpace.decamelize(),
          viewName = type.decamelize(),
          viewdef = XT.getViewDefinition(viewName, schemaName),
          orm = XT.getORM(nameSpace, type);

      /* set data type property */
      record['type'] = type.classify();

      /* set data state property */
      record['dataState'] = this.READ_STATE;

      for(var prop in record) {
        if (record.hasOwnProperty(prop)) {
          var coldef = viewdef.findProperty('attname', prop),
          value, result, sql = '',
          ormp = XT.getProperty(orm, prop.camelize());

          /* handle encryption if applicable */
          if(ormp && ormp.attr && ormp.attr.isEncrypted) {
            if(encryptionKey) {
              sql = "select formatbytea(decrypt(setbytea($1), setbytea($2), 'bf')) as result";
              record[prop] = executeSql(sql, [record[prop], encryptionKey])[0].result;
            } else {
              record[prop] = '**********'
            }
          }

          /* if it's a compound type, add a type property */
          if (coldef['typcategory'] === this.COMPOUND_TYPE && record[prop]) {
            var typeName = coldef['typname'].classify();

            /* if no privileges remove the data */
            if(this.checkPrivileges(nameSpace, typeName, null, false)) {
              record[prop]['type'] = typeName;
              record[prop]['dataState'] = this.READ_STATE;
              record[prop] = XT.camelize(record[prop]);
            } else {
              delete record[prop];
            }
            
          /* if it's an array convert each row into an object */
          } else if (coldef['typcategory'] === this.ARRAY_TYPE && 
                     record[prop].length &&
                     isNaN(record[prop][0])) {
            var key = coldef['typname'].substring(1).classify(); /* strip off the leading underscore */

            /* if no privileges remove the data */  
            if(this.checkPrivileges(nameSpace, key, null, false)) {
              for (var i = 0; i < record[prop].length; i++) {
                var value = record[prop][i];

                value['type'] = key;
                value['dataState'] = this.READ_STATE;
                record[prop][i] = this.normalize(nameSpace, key, value);
              }
            } else {
              delete record[prop];    
            }
          }
        }
      }
      return XT.camelize(record);
    },

    /**
    Retreives a single record from the database. If the user does not have appropriate privileges an
    error will be thrown.
    
    @param {String} namespace qualified record type
    @param {Number} record id
    @param {String} encryption key
    @returns {Object} 
    */
    retrieveRecord: function(recordType, id, encryptionKey) {
      var nameSpace = recordType.beforeDot(), 
          type = recordType.afterDot(),
          map = XT.getORM(nameSpace, type),
          ret, sql, pkey = XT.getPrimaryKey(map), i = 0;

      if(!pkey) throw new Error('No primary key found for {recordType}'.replace(/{recordType}/, recordType));

      sql = "select * from {schema}.{table} where {primaryKey} = $1;"
            .replace(/{schema}/, nameSpace.decamelize())
            .replace(/{table}/, type.decamelize())
            .replace(/{primaryKey}/, pkey)
            .replace(/{id}/, id);  

      /* validate - don't bother running the query if the user has no privileges */
      if(!this.checkPrivileges(nameSpace, type)) throw new Error("Access Denied.");

      /* query the map */
      if(DEBUG) print(NOTICE, 'sql = ', sql);

      ret = executeSql(sql, [id]);

      if(!ret.length) throw new Error('No record found for {recordType} id {id}'
                                      .replace(/{recordType}/, recordType)
                                      .replace(/{id}/, id));

      ret = this.normalize(nameSpace, type, ret[0], encryptionKey);

      /* check privileges again, this time against record specific criteria where applicable */
      if(!this.checkPrivileges(nameSpace, type, ret)) throw new Error("Access Denied.");

      /* return the results */
      return ret;
    },

    /** 
    Convert a record object to PostgresSQL row formatted string.

    @param {String} the column type
    @param {Object} data to convert
    @returns {String} a string formatted like a postgres RECORD datatype 
    */
    rowify: function(key, value) {
      var viewName = key.afterDot().decamelize(), 
          schemaName = key.beforeDot().decamelize(),
          viewdef = XT.getViewDefinition(viewName, schemaName),
          record = XT.decamelize(value),
          props = [], ret = '';

      /* remove potential fields not part of data definition */
      delete record['data_state'];
      delete record['type'];

      for(var prop in record) {
        var coldef = viewdef.findProperty('attname', prop);
        if(prop) {
          if(coldef.typcategory === this.ARRAY_TYPE) { 
            /* orm rules ignore arrays, but we need this place holder so type signatures match */
            props.push("'{}'");  
          } else if(coldef.typcategory === this.COMPOUND_TYPE) { 
            record[prop] = this.rowify(schemaName + '.' + coldef.attname, record[prop]);
            props.push(record[prop]); 
          } else if(coldef.typcategory === this.STRING_TYPE ||
                    coldef.typcategory === this.DATE_TYPE) {
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

