create or replace function private.init_js() returns void as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  DEBUG = false;
  
  // ..........................................................
  // METHODS
  //

  /* extend array type to check for an existing value */
  Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
      if (this[i] === obj) {
        return true;
      }
    }
    return false;
  }

  /* Returns an the first item in an array with a property matching the passed value.  

     @param {String} property name to search on
     @param {Any} value to search for
     @param Object item found or null
  */
  Array.prototype.findProperty = function(key, value) {
    for(var i = 0; i < this.length; i++) {
      for(var prop in this[i]) {
        if(prop === key &&
           this[i][prop] === value) {
             return this[i];
        }
      }
    }
    
    return false;
  }

  /* Trim whitespace from a string */
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g,"");
  }

  /* Change sting with underscores '_' to camel case.

     @returns {String}
  */
  String.prototype.camelize = function() {
    var self = this,
        ret = self.replace( (/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g), function(self, separater, character) {
          return character ? character.toUpperCase() : '';
    });

    var first = ret.charAt(0),
        lower = first.toLowerCase();

    return first !== lower ? lower + ret.slice(1) : ret;
  };

  /* Converts the string into a class name. This method will camelize 
     your string and then capitalize the first letter.

     @returns {String}
  */
  String.prototype.classify = function() {
    return this.slice(0,1).toUpperCase() + this.slice(1).camelize();
  }

  /* Change a camel case string to snake case.

     @returns {String} The argument modified
  */
  String.prototype.decamelize = function() {
    return this.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase();
  }

  // ..........................................................
  // XT
  //

  XT = {};

  /* Change properties names on an object with underscores '_' to camel case.
     Only changes immediate properties, it is not recursive.

     @param {Object | String}
     @returns {Object | String}
  */
  XT.camelize = function(obj) {
    var ret = {};

    if(typeof obj === "object") {
      for(var prop in obj) ret[prop.camelize()] = obj[prop];
    }
    else if(typeof obj === "string") return obj.camelize();
     
    return ret;
  }

  /* Change camel case property names in an object to snake case.
     Only changes immediate properties, it is not recursive.

     @param {Object | String} The object to decamelize
     @returns {Object | String} The argument modified
  */
  XT.decamelize = function(obj) {
    var ret = {};

    if(typeof obj === "object") {
      for(var prop in obj) ret[prop.decamelize()] = obj[prop];
    }
    else if(typeof obj === "string") return obj.decamelize();

    return ret;
  }

  /* Pass a record type and return an array
     that describes the view definition with
     item representing a column.

     @param {String} view name
     @param {String} schema name
     @returns {Object} 
  */
  XT.getViewDefinition = function(viewName, schemaName) {
    var sql = "select attnum, attname, typname, typcategory "
            + "from pg_class c, pg_namespace n, pg_attribute a, pg_type t "
            + "where c.relname = $1 "
            + "and n.nspname = $2 "
	    + "and n.oid = c.relnamespace "
	    + "and a.attnum > 0 "
	    + "and a.attrelid = c.oid "
	    + "and a.atttypid = t.oid "
	    + "order by attnum";

    return executeSql(sql, [ viewName, schemaName ]);
  }

  /* Return a map definition based on a recordType name.

     @param {String} recordType
     @returns {Object}
  */
  XT.fetchMap = function(nameSpace, type) {
    if(!this._maps) this._maps = [];
    
    var ret, recordType = nameSpace + '.'+ type,
        res = this._maps.findProperty('recordType', recordType);
    
    if(res) ret = res.map;
    else {
      var sql = 'select orm_json as json '
              + 'from private.orm '
              + 'where orm_namespace=$1'
              + ' and orm_type=$2'
              + ' and not orm_ext',
          res = executeSql(sql, [ nameSpace, type ]);

      if(!res.length) {
        throw new Error("No map definition for " + recordType + " found.");
      }

      ret = JSON.parse(res[0].json);

      /* cache the result so we don't requery needlessly */
      this._maps.push({ "recordType": recordType, "map": ret});
    }

    return ret;
  }

  // ..........................................................
  // XT.Data
  //

  XT.Data = {

    ARRAY_TYPE: "A",
    COMPOUND_TYPE: "C",
    DATE_TYPE: "D",
    STRING_TYPE: "S",
  
    CREATED_STATE: 'created',
    READ_STATE: "read",
    UPDATED_STATE: 'updated',
    DELETED_STATE: 'deleted',

    /* Accept a privilege name and calculate whether
     the current user has the privilege.

     @param {String} privilege
     @returns {Boolean}
    */
    checkPrivilege: function(privilege) {
      var ret = false;
       
      if(privilege) {
        if(!this._grantedPrivs) this._grantedPrivs = [];

        if(this._grantedPrivs.contains(privilege)) return true;
    
        var res = executeSql("select checkPrivilege($1) as is_granted", [ privilege ]),
          ret = res[0].is_granted;

        /* cache the result locally so we don't requery needlessly */
        if(ret) this._grantedPrivs.push(privilege);
      }

      return ret;
    },
  
    /* Validate whether user has read access to the data.
       If a record is passed, check personal privileges of
       that record.

       @param {String} type name
       @param {Object} Record - optional
       @returns {Boolean}
    */
    checkPrivileges: function(nameSpace, type, record, isTopLevel) {
      var isTopLevel = isTopLevel !== false ? true : false,
          isGrantedAll = true,
          isGrantedPersonal = false,
          map = XT.fetchMap(nameSpace, type),
          privileges = map.privileges,
          committing = record ? record.dataState !== this.READ_STATE : false;
          action =  record && record.dataState === this.CREATED_STATE ? 'create' : 
                    record && record.dataState === this.DELETED_STATE ? 'delete' : 'update';

      /* can not access nested records directly */
      if(isTopLevel && map.isNested) return false
          
      /* check privileges - only general access here */
      if(privileges) { 
        /* check if user has 'all' read privileges */
        isGrantedAll = privileges.all ? 
                       ((committing ? false : this.checkPrivilege(privileges.all.read)) || 
                        this.checkPrivilege(privileges.all[action])) : false;

        /* otherwise check for 'personal' read privileges */
        if(!isGrantedAll) isGrantedPersonal =  privileges.personal ? 
                                              ((committing ? false : this.checkPrivilege(privileges.personal.read)) || 
                                               this.checkPrivilege(privileges.personal[action])) : false;
      }
      
      /* if committing and personal privileges we need to ensure the old record is editable */
      if(committing && !isGrantedAll && isGrantedPersonal) {
        /* TODO: Need a qualified record type here to do this retrieve record */
        var old = this.retrieveRecord(recordType, record.guid);

        isGrantedPersonal = this.checkPrivileges(nameSpace, old);

      /* check personal privileges on the record passed if applicable */
      } else if(record && !isGrantedAll && isGrantedPersonal) {
        var i = 0, props = privileges.personal.properties;
      
        isGrantedPersonal = false;
      
        while(!isGrantedPersonal && i < props.length) {
          var prop = props[i];
          isGrantedPersonal = record[prop].username === this.currentUser();
          i++;
        }
      }
      return isGrantedAll || isGrantedPersonal;
    },
    
    /* Commit array columns with their own statements 
    
       @param {Object} record object to be committed
       @param {Object} view definition object
    */
    commitArrays: function(nameSpace, record, viewdef) {
      for(var prop in record) {
        var coldef = viewdef.findProperty('attname', prop);

        if (coldef['typcategory'] === this.ARRAY_TYPE) {
            var key = nameSpace + '.' + coldef['typname'].substring(1); /* strip underscore from (array) type name */
                values = record[prop]; 

          for(var i in values) {
            this.commitRecord(key.classify(), values[i], false);
          }
        }
      }   
    },

    /* Commit a record to the database 

       @param {String} name space qualified record type
       @param {Object} data object
    */
    commitRecord: function(key, value, isTopLevel) {
      var isTopLevel = isTopLevel !== false ? true : false,
          nameSpace = key.replace(/\.\w+/i, '').camelize().toUpperCase(),
          type = key.replace(/\w+\./i, '').classify();

      var hasAccess = this.checkPrivileges(nameSpace, type, value, false);

      if(!hasAccess) throw new Error("Access Denied.");
      
      if(value && value.dataState) {
        if(value.dataState === this.CREATED_STATE) { 
          this.createRecord(key, value, isTopLevel);
        }
        else if(value.dataState === this.UPDATED_STATE) { 
          this.updateRecord(key, value, isTopLevel);
        }
        else if(value.dataState === this.DELETED_STATE) { 
          this.deleteRecord(key, value, isTopLevel); 
        }
      }
    },

    /* Commit insert to the database 

       @param {String} name space qualified record type
       @param {Object} the record to be committed
    */
    createRecord: function(key, value) {
      var viewName = key.decamelize().replace(/\w+\./i, ''), 
          schemaName = key.decamelize().replace(/\.\w+/i, ''),    
          viewdef = XT.getViewDefinition(viewName, schemaName),
          record = XT.decamelize(value),
          sql = '', columns, expressions,
          props = [], params = [];

      /* build up the content for insert of this record */
      for(var prop in record) {
        var coldef = viewdef.findProperty('attname', prop);
        
        if (prop !== 'data_state' && 
            prop !== 'type' && 
            coldef.typcategory !== this.ARRAY_TYPE) { 
          props.push(prop);
          if(record[prop]) { 
            if (coldef.typcategory === this.COMPOUND_TYPE) { 
              var row = this.rowify(schemaName + '.' + coldef.typname, record[prop]);

              record[prop] = row;
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

    /* Commit update to the database 

       @param {String} name space qualified record type
       @param {Object} the record to be committed
    */
    updateRecord: function(key, value) {
      var viewName = key.decamelize().replace(/\w+\./i, ''), 
          schemaName = key.decamelize().replace(/\.\w+/i, ''),
          viewdef = XT.getViewDefinition(viewName, schemaName),
          record = XT.decamelize(value),
          sql = '', expressions, params = [];

      /* build up the content for update of this record */
      for(var prop in record) {
        var coldef = viewdef.findProperty('attname', prop);

        if (prop !== 'data_state' &&
            prop !== 'type' && 
            coldef.typcategory !== this.ARRAY_TYPE) {
          if(record[prop]) { 
            if (coldef.typcategory === this.COMPOUND_TYPE) {
              var row = this.rowify(schemaName + '.' + coldef.typname, record[prop]);
              
              record[prop] = row;
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
      sql = 'update {recordType} set {expressions} where guid = {id};'
            .replace(/{recordType}/, key.decamelize())
            .replace(/{expressions}/, expressions)
            .replace(/{id}/, record.guid);
      
      if(DEBUG) { print(NOTICE, 'sql =', sql); }
      
      /* commit the record */
      executeSql(sql); 

      /* okay, now lets handle arrays */
      this.commitArrays(schemaName, record, viewdef); 
    },

    /* Commit deletion to the database 

       @param {String} name space qualified record type
       @param {Object} the record to be committed
    */
    deleteRecord: function(key, value) {
      var record = XT.decamelize(value), sql = '';

      sql = 'delete from {recordType} where guid = {id};'
            .replace(/{recordType}/, key.decamelize())
            .replace(/{id}/, record.guid);
      
      if(DEBUG) { print(NOTICE, 'sql =', sql); }
      
      /* commit the record */
      executeSql(sql); 
    },

    /* Returns the currently logged in user.
    
       @returns {String} 
    */
    currentUser: function() {
      var res;

      if(!this._currentUser) {
        res = executeSql("select getEffectiveXtUSer() as curr_user");

        /* cache the result locally so we don't requery needlessly */
        this._currentUser = res[0].curr_user;
      }

      return this._currentUser;
    },

    /* Additional processing on record properties. 
       Adds 'type' property, stringifies arrays and
       camelizes the record.
    
       @param {Object} record object to be committed
       @param {Object} view definition object
       @returns {Object} 
    */
    normalize: function(nameSpace, map, record) {
      var viewdef = XT.getViewDefinition(map, nameSpace.decamelize());

      /* helper formatting function */
      formatTypeName = function(str) {
        return str.slice(0,1).toUpperCase() + str.substring(1).camelize();
      }

      /* set data type property */
      record['type'] = formatTypeName(map);

      /* set data state property */
      record['dataState'] = this.READ_STATE;

      for(var prop in record) {
        if (record.hasOwnProperty(prop)) {
          var coldef = viewdef.findProperty('attname', prop),
          value, result, sql = '';

            /* if it's a compound type, add a type property */
            if (coldef['typcategory'] === this.COMPOUND_TYPE && record[prop]) {
              record[prop]['type'] = formatTypeName(coldef['typname']);
              record[prop]['dataState'] = this.READ_STATE;
              
            /* if it's an array convert each row into an object */
            } else if (coldef['typcategory'] === this.ARRAY_TYPE && record[prop]) {
              var key = coldef['typname'].substring(1); /* strip off the leading underscore */

            for (var i = 0; i < record[prop].length; i++) {
              var value = record[prop][i];

              sql = "select (cast('" + value + "' as " + nameSpace + "." + key + ")).*";

              if(DEBUG) print(NOTICE, 'sql: ', sql);

              result = executeSql(sql);

              for (var k = 0; k < result.length; k++) {
                result[k]['type'] = formatTypeName(key);
                result[k]['dataState'] = this.READ_STATE;
                record[prop][i] = this.normalize(nameSpace, key, result[k]);
              }
            }
          }
        }
      }
      return XT.camelize(record);
    },

    /* Retreives a single record from the database. If
       the user does not have appropriate privileges an
       error will be thrown.
    
       @param {String} namespace qualified record type
       @param {Number} record id
       @returns {Object} 
    */
    retrieveRecord: function(recordType, id) {
      var nameSpace = recordType.replace((/\.\w+/i),''), 
          type = recordType.replace((/\w+\./i),''),
          ret, 
          sql = "select * from {schema}.{table} where guid = {id};"
                .replace(/{schema}/, nameSpace)
                .replace(/{table}/, type)
                .replace(/{id}/, id);  

      /* validate - don't bother running the query if the user has no privileges */
      if(!this.checkPrivileges(nameSpace, type)) throw new Error("Access Denied.");

      /* query the map */
      if(DEBUG) print(NOTICE, 'sql = ', sql);
      
      ret = this.normalize(nameSpace, type, executeSql(sql)[0]);

      /* check privileges again, this time against record specific criteria where applicable */
      if(!this.checkPrivileges(nameSpace, type, ret)) throw new Error("Access Denied.");

      /* return the results */
      return ret;
    },

    /* Convert object to PostgresSQL row type

       @param {String} the column type
       @param {Object} data to convert
       @returns {String} a string formatted like a postgres RECORD datatype 
    */
    rowify: function(key, value) {
      var viewName = key.decamelize().replace(/\w+\./i, ''), 
          schemaName = key.decamelize().replace(/\.\w+/i, ''),
          viewdef = XT.getViewDefinition(viewName, schemaName),
          record = XT.decamelize(value),
          props = [], ret = '';

      /* remove potential fields not part of data definition */
      delete record['data_state'];
      delete record['type'];

      for(var prop in record) {
        var coldef = viewdef.findProperty('attname', prop);
        if(prop) {
          if(coldef.typcategory !== this.ARRAY_TYPE) { 
            if(coldef.typcategory === this.COMPOUND_TYPE) { 
              record[prop] = this.rowify(schemaName + '.' + coldef.attname, record[prop]);
            }
            if(coldef.typcategory === this.STRING_TYPE ||
               coldef.typcategory === this.DATE_TYPE) {
              props.push("'" + record[prop] + "'"); 
            } else {
              props.push(record[prop]);
            }
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

  this.isInitialized = true;

$$ language plv8;

