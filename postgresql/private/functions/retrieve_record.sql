create or replace function private.retrieve_record(data_hash text) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* constants */
  var COMPOUND_TYPE = "C",
      ARRAY_TYPE = "A",
      READ_STATE = "read",
      local = {};

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

     @param {Object} an array to search
     @param {String} property name to search on
     @param {Any} value to search for
     @param Object item found or null
  */
  findProperty = function(ary, key, value) {
    for(var i = 0; i < ary.length; i++) {
      for(var prop in ary[i]) {
        if(prop === key &&
           ary[i][prop] === value) {
             return ary[i];
        }
      }
    }
    
    return false;
  }

  /* Pass an argument to change names with underscores '_' camel case.
     A string passed in simply returns a camelized string.
     If an object is passed, an object is returned with all it's
     proprety names camelized.

     @param {String | Object}
     @returns {String | Object} decamelized argument
  */
  camelize = function(arg) {
    var ret = arg; 

    camelizeStr = function(str) {
      var rtn = str.replace( (/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g), function(str, separater, character) {
        return character ? character.toUpperCase() : '';
      });

      var first = rtn.charAt(0),
          lower = first.toLowerCase();

      return first !== lower ? lower + ret.slice(1) : rtn;
    };

    if(typeof arg == "string") {
      ret = camelizeStr(arg);
    } else if(typeof arg == "object") {
      ret = new Object;

      for(var prop in arg) {
        ret[camelizeStr(prop)] = arg[prop];
      }
    }
   
    return ret;
  }

  /* Pass an argument to change camel case names to snake case.
     A string passed in simply returns a decamelized string.
     If an object is passed, an object is returned with all it's
     proprety names camelized.

     @param {String | Object}
     @returns {String | Object} The argument modified
  */
  decamelize = function(arg) {
    var ret = arg; 

    decamelizeStr = function(str) {
      return str.replace((/([a-z])([A-Z])/g), '$1_$2').toLowerCase();
    }

    if(typeof arg == "string") {
      ret = decamelizeStr(arg);
    } else if(typeof arg == "object") {
      ret = new Object;

      for(var prop in arg) {
        ret[decamelizeStr(prop)] = arg[prop];
      }
    }

    return ret;
  }

  /* Additional processing on record properties. 
     Adds 'type' property, stringifies arrays and
     camelizes the record.
  
     @param {Object} record object to be committed
     @param {Object} view definition object
  */
  normalize = function(nameSpace, map, record) {
    var viewdef = getViewDefinition(map, nameSpace);

    /* helper formatting function */
    formatTypeName = function(str) {
      return str.slice(0,1).toUpperCase() + camelize(str.substring(1));
    }

    /* set data type property */
    record['type'] = formatTypeName(map);

    /* set data state property */
    record['dataState'] = READ_STATE;

    for(var prop in record) {
      if (record.hasOwnProperty(prop)) {
        var coldef = findProperty(viewdef, 'attname', prop),
	    value, result, sql = '';

        /* if it's a compound type, add a type property */
        if (coldef['typcategory'] === COMPOUND_TYPE && record[prop]) {
          record[prop]['type'] = formatTypeName(coldef['typname']);
          record[prop]['dataState'] = READ_STATE;
          
        /* if it's an array convert each row into an object */
        } else if (coldef['typcategory'] === ARRAY_TYPE && record[prop]) {
          var key = coldef['typname'].substring(1); /* strip off the leading underscore */

	  for (var i = 0; i < record[prop].length; i++) {
	    var value = record[prop][i];

	    sql = "select (cast('" + value + "' as " + nameSpace + "." + key + ")).*";

	    if(debug) print(NOTICE, 'sql: ', sql);

	    result = executeSql(sql);

	    for (var k = 0; k < result.length; k++) {
	      result[k]['type'] = formatTypeName(key);
	      result[k]['dataState'] = READ_STATE;
	      record[prop][i] = normalize(nameSpace, key, result[k]);
	    }
          }
        }
      }
    }
    return camelize(record);
  }

  /* Pass a record type and return an array
     that describes the view definition with
     item representing a column.

     @param {String} recordType
     @returns {Object} 
  */
  getViewDefinition = function(recordType, nameSpace) {
    var sql = "select attnum, attname, typname, typcategory "
            + "from pg_class c, pg_namespace n, pg_attribute a, pg_type t "
            + "where c.relname = $1 "
            + "and n.nspname = $2 "
	    + "and n.oid = c.relnamespace "
	    + "and a.attnum > 0 "
	    + "and a.attrelid = c.oid "
	    + "and a.atttypid = t.oid "
	    + "order by attnum";

    if(debug) { print(NOTICE, 'viewdefSql = ', sql) };

    return executeSql(sql, [ recordType, nameSpace ]);
  }

  /* Return a map definition based on a recordType name.

     @param {String} recordType
     @returns {Object}
  */
  fetchMap = function(name) {
    var sql = 'select orm_json as json '
            + 'from private.orm '
            + 'where orm_name=$1',
        res = executeSql(sql, [ recordType ]), 
        map, isGranted = false;

    if(!res.length) {
      throw new Error("No map definition for " + recordType + " found.");
    }

    return JSON.parse(res[0].json);
  }

  /* Accept a privilege name and calculate whether
     the current user has the privilege.

     @param {String} privilege
     @returns {Boolean}
  */
  checkPrivilege = function(privilege) {
    var ret = false;
       
    if(privilege) {
      if(!local._grantedPrivs) local._grantedPrivs = [];

      if(local._grantedPrivs.contains(privilege)) return true;
    
      var res = executeSql("select checkPrivilege($1) as is_granted", [ privilege ]),
          ret = res[0].is_granted;

      /* cache the result locally so we don't requery needlessly */
      if(ret) local._grantedPrivs.push(privilege);
    }

    return ret;
  }

  currentUser = function() {
    var res;

    if(!local._currentUser) {
      res = executeSql("select getEffectiveXtUSer() as curr_user");

      /* cache the result locally so we don't requery needlessly */
      local._currentUser = res[0].curr_user;
    }

    return local._currentUser;
  }
  
  /* Validate whether user has read access to the data.
     If a record is passed, check personal privileges of
     that record.

     @param {Object} Map
     @param {Object} Record - optional
     @returns {Boolean}
  */
  checkPrivileges = function(map, record) {
    var isGrantedAll = false,
        isGrantedPersonal = false,
        privileges = map.privileges;

    /* check privileges - only general access here */
    if(privileges) {
      /* check if user has 'all' read privileges */
      isGrantedAll = privileges.all ? 
                     (checkPrivilege(privileges.all.read) || 
                      checkPrivilege(privileges.all.update)) : false;

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
  }

  // ..........................................................
  // PROCESS
  //

  var dataHash = JSON.parse(data_hash),
      nameSpace = dataHash.recordType.replace((/\.\w+/i),'').toLowerCase(), 
      recordType = decamelize(dataHash.recordType.replace((/\w+\./i),'')),
      id = dataHash.id, 
      prettyPrint = dataHash.prettyPrint ? 2 : null,
      map = fetchMap(recordType),
      debug = false, rec,
      sql = "select * from {nameSpace}.{recordType} where guid = {id};"
            .replace(/{nameSpace}/, nameSpace)
            .replace(/{recordType}/, recordType)
            .replace(/{id}/, id);  

  /* validate - don't bother running the query if the user has no privileges */
  if(!checkPrivileges(map)) throw new Error("Access Denied.");

  /* query the map */
  if(debug) print(NOTICE, 'sql = ', sql);
  
  rec = normalize(nameSpace, recordType, executeSql(sql)[0]);

  /* check privileges again, this time against record specific criteria where applicable */
  if(!checkPrivileges(map, rec)) throw new Error("Access Denied.");

  /* return the results */
  return JSON.stringify(rec, null, prettyPrint);

$$ language plv8;
/*
select private.retrieve_record('{
  "recordType":"XM.Contact", 
  "id": 1,
  "prettyPrint": true
  }'
);
*/
