create or replace function private.js_data() returns void as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  XT.Data = {

    ARRAY_TYPE: "A",
    COMPOUND_TYPE: "C",
    DATE_TYPE: "D",
    STRING_TYPE: "S",
  
    CREATED_STATE: 'created',
    READ_STATE: "read",
    UPDATED_STATE: 'updated',
    DELETED_STATE: 'deleted',

    /* Build a SQL clause based on privileges for name space
       and type, and conditions and parameters passed. Input 
       Conditions and parameters are presumed to conform to 
       SproutCore's SC.Query syntax. 
         
       http://sproutcore.com/docs/#doc=SC.Query

       @param {String} name space
       @param {String} type
       @param {Object} conditions - optional
       @param {Object} parameters - optional
       @returns {Boolean}
    */
    buildClause: function(nameSpace, type, conditions, parameters) {
      var ret = ' true ', cond = '', pcond = '',
          map = XT.fetchMap(nameSpace, type),
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
      if((!privileges ||
          !privileges.all ||
         (!this.checkPrivilege(privileges.all.read) && 
          !this.checkPrivilege(privileges.all.update)) &&
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
          map = XT.fetchMap(nameSpace, type),
          privileges = map.privileges,
          committing = record ? record.dataState !== this.READ_STATE : false;
          action =  record && record.dataState === this.CREATED_STATE ? 'create' : 
                    record && record.dataState === this.DELETED_STATE ? 'delete' :
                    record && record.dataState === this.UPDATED_STATE ? 'update' : 'read';

      /* can not access nested records directly */
      if(isTopLevel && map.isNested) return false
        
      /* check privileges - only general access here */
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

      if(record && !isGrantedAll && isGrantedPersonal) {
        var that = this,

        checkPersonal = function(record) {
          var i = 0, isGranted = false,
              props = privileges.personal.properties;

          while(!isGranted && i < props.length) {
            var prop = props[i];
            isGranted = record[prop].username === that.currentUser();
            i++;
          }

          return isGranted;
        };  
        /* if committing and personal privileges we need to ensure the old record is editable */
        if(committing && (action === 'update' || action === 'delete')) {
          var old = this.retrieveRecord(nameSpace + '.' + type, record.guid);

          isGrantedPersonal = checkPersonal(old);
        /* check personal privileges on the record passed if applicable */
        } else if(action === 'read') {
          isGrantedPersonal = checkPersonal(record);
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
          nameSpace = key.beforeDot().camelize().toUpperCase(),
          type = key.afterDot().classify();

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
      var viewName = key.afterDot().decamelize(), 
          schemaName = key.beforeDot().decamelize(),    
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
      var viewName = key.afterDot().decamelize(), 
          schemaName = key.beforeDot().decamelize(),
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
        res = executeSql("select getEffectiveXtUser() as curr_user");

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
      var nameSpace = recordType.beforeDot(), 
          type = recordType.afterDot(),
          map = XT.fetchMap(nameSpace, type),
          ret, sql, pkey, i = 0;

      /* find primary key */
      while (!pkey && i < map.properties.length) {
        if(map.properties[i].attr && 
           map.properties[i].attr.isPrimaryKey)
          pkey = map.properties[i].name;

        i++;
      }

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
      
      ret = this.normalize(nameSpace, type, ret[0]);

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

$$ language plv8;

select private.register_js('XT','Data','xtuple','private.js_data');

