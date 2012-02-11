create or replace function private.init_js() returns void as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
  
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
        rtn = self.replace( (/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g), function(self, separater, character) {
          return character ? character.toUpperCase() : '';
    });

    var first = rtn.charAt(0),
        lower = first.toLowerCase();

    return first !== lower ? lower + ret.slice(1) : rtn;
  };

  /* Change a camel case string to snake case.

     @returns {String} The argument modified
  */
  String.prototype.decamelize = function() {
    return this.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase();
  }
  
  /* Change properties names with underscores '_' to camel case.
     Only changes immediate properties, it is not recursive.

     @returns {Object}
  */
  Object.prototype.camelize = function() {
    var ret = {};

    for(var prop in this) ret[prop.camelize()] = this[prop];
   
    return ret;
  }

  /* Change camel case property names names to snake case.
     Only changes immediate properties, it is not recursive.

     @returns {String | Object} The argument modified
  */
  Object.prototype.decamelize = function() {
    var ret = {};

    for(var prop in arg) ret[prop.decamelize()] = arg[prop];

    return ret;
  }

  // ..........................................................
  // XT
  //

  XT = {};

  /* Pass a record type and return an array
     that describes the view definition with
     item representing a column.

     @param {String} recordType
     @returns {Object} 
  */
  XT.getViewDefinition = function(recordType, nameSpace) {
    var sql = "select attnum, attname, typname, typcategory "
            + "from pg_class c, pg_namespace n, pg_attribute a, pg_type t "
            + "where c.relname = $1 "
            + "and n.nspname = $2 "
	    + "and n.oid = c.relnamespace "
	    + "and a.attnum > 0 "
	    + "and a.attrelid = c.oid "
	    + "and a.atttypid = t.oid "
	    + "order by attnum";

    return executeSql(sql, [ recordType, nameSpace ]);
  }

  /* Return a map definition based on a recordType name.

     @param {String} recordType
     @returns {Object}
  */
  XT.fetchMap = function(name) {
    var sql = 'select orm_json as json '
            + 'from private.orm '
            + 'where orm_name=$1',
        res = executeSql(sql, [ name ]);

    if(!res.length) {
      throw new Error("No map definition for " + name + " found.");
    }

    return JSON.parse(res[0].json);
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

       @param {Object} Map
       @param {Object} Record - optional
       @returns {Boolean}
    */
    checkPrivileges: function(map, record) {
      var isGrantedAll = false,
          isGrantedPersonal = false,
          privileges = map.privileges;

      /* check privileges - only general access here */
      if(privileges) {
        /* check if user has 'all' read privileges */
        isGrantedAll = privileges.all ? 
                       (this.checkPrivilege(privileges.all.read) || 
                        this.checkPrivilege(privileges.all.update)) : false;

        /* otherwise check for 'personal' read privileges */
        if(!isGrantedAll) isGrantedPersonal =  privileges.personal ? 
                                              (checkPrivilege(privileges.personal.read) || 
                                               checkPrivilege(privileges.personal.update)) : false;
      }

      /* check personal privileges on the record passed if applicable */
      if(record && !isGrantedAll && isGrantedPersonal && privileges.personal.properties) {
        var i = 0, props = privileges.personal.properties;
      
        isGrantedPersonal = false;
      
        while(!isGrantedPersonal && i < props.length) {
          var prop = props[i];
          isGrantedPersonal = record[prop].username === currentUser();
          i++;
        }
      }

      return isGrantedAll || isGrantedPersonal;
    },

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
    */
    normalize: function(nameSpace, map, record) {
      var viewdef = XT.getViewDefinition(map, nameSpace);

      /* helper formatting function */
      formatTypeName = function(str) {
        return str.slice(0,1).toUpperCase() + str.substring(1).camelize();
      }

      /* set data type property */
      record['type'] = formatTypeName(map);

      /* set data state property */
      record['dataState'] = XT.Data.READ_STATE;

      for(var prop in record) {
        if (record.hasOwnProperty(prop)) {
          var coldef = viewdef.findProperty('attname', prop),
          value, result, sql = '';

            /* if it's a compound type, add a type property */
            if (coldef['typcategory'] === XT.Data.COMPOUND_TYPE && record[prop]) {
              record[prop]['type'] = formatTypeName(coldef['typname']);
              record[prop]['dataState'] = XT.Data.READ_STATE;
              
            /* if it's an array convert each row into an object */
            } else if (coldef['typcategory'] === XT.Data.ARRAY_TYPE && record[prop]) {
              var key = coldef['typname'].substring(1); /* strip off the leading underscore */

            for (var i = 0; i < record[prop].length; i++) {
              var value = record[prop][i];

              sql = "select (cast('" + value + "' as " + nameSpace + "." + key + ")).*";

              if(debug) print(NOTICE, 'sql: ', sql);

              result = executeSql(sql);

              for (var k = 0; k < result.length; k++) {
                result[k]['type'] = formatTypeName(key);
                result[k]['dataState'] = XT.Data.READ_STATE;
                record[prop][i] = this.normalize(nameSpace, key, result[k]);
              }
            }
          }
        }
      }
      return record.camelize();
    }
  }

  this.isInitialized = true;

$$ language plv8;

