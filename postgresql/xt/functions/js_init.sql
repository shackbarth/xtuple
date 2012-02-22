create or replace function xt.js_init() returns void as $$
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

  Array.prototype.indexOf = function(obj) {
    var i = this.length;
    while (i--) {
      if (this[i] === obj) {
        return i;
      }
    }
    return -1;
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

  /* return the text before the first dot */
  String.prototype.afterDot = function() {
    return this.replace(/\w+\./i, '');
  }
  
  /* return the text before the first dot */
  String.prototype.beforeDot = function() {
    return this.replace(/\.\w+/i, '');
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
      for(var prop in obj) {
        for(var prop in obj) ret[prop.camelize()] = obj[prop];
      }
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

  /* Return a map definition.

     @param {String} name space
     @param {String} type
     @returns {Object}
  */
  XT.getORM = function(nameSpace, type) {
    if(!this._maps) this._maps = [];
    
    var ret, recordType = nameSpace + '.'+ type,
        res = this._maps.findProperty('recordType', recordType);
    
    if(res) ret = res.map;
    else {
      var sql = 'select orm_json as json '
              + 'from xt.orm '
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

  /* Returns the primary key as designated in an ORM map.

     @param {Object} ORM
     @returns{String}
  */
  XT.getPrimaryKey = function(orm) {
    /* find primary key */
    for(var i = 0; i < orm.properties.length; i++) {
      if(orm.properties[i].attr && 
         orm.properties[i].attr.isPrimaryKey)
        return orm.properties[i].name;
    }

    return false;
  }

  // ..........................................................
  // PROCESS
  //

 var res, sql;

  /* create namespace objects for all registered javascript */
  sql = 'select distinct js_namespace as "nameSpace" '
        + 'from xt.js '
        + 'where js_active; '

  res = executeSql(sql);

  if(res.length) {
    for(var i = 0; i < res.length; i++) {
      if(!this[res[i].nameSpace]) this[res[i].nameSpace] = {};
    }
       
    /* load up all active javascript installed in the database */
    /* TODO: What about dependencies? */
    sql = 'select js_text as "javascript" '
        + 'from xt.js '
        + 'where js_active '
        + 'order by js_ext ';

    res = executeSql(sql);

    if(res.length) {
      for(var i = 0; i < res.length; i++) {
        eval(res[i].javascript);
      }
    }
  }
  
  this.isInitialized = true;

$$ language plv8;

