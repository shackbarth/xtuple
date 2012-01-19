create or replace function private.retrieve_record(record_type text, id integer) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */

  /* constants */
  var COMPOUND_TYPE = "C",
      ARRAY_TYPE = "A";

  // ..........................................................
  // METHODS
  //

  /* Returns an the first item in an array with a property matching the passed value.  

     @param {Object} an array to search
     @param {String} property name to search on
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

  /* Additional processing on record properties. 
     Adds 'type' property, stringifies arrays and
     camelizes the record.
  
     @param {Object} record object to be committed
     @param {Object} view definition object
  */
  normalize = function(nameSpace, model, record) {
    var viewdef = getViewDefinition(model, nameSpace);

    for(var prop in record) {
      if (record.hasOwnProperty(prop)) {
        var coldef = findProperty(viewdef, 'attname', prop),
	    value, result, sql = '';

	 /* helper formatting function */
        formatTypeName = function(str) {
          return str.slice(0,1).toUpperCase() + camelize(str.substring(1));
        }

        /* if it's a compound type, add a type property */
        if (coldef['typcategory'] === COMPOUND_TYPE && record[prop]) {
          record[prop]['type'] = formatTypeName(coldef['typname']);
          
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
	      record[prop][i] = normalize(nameSpace, key, result[k]);
	    }
          }
        }
      }
    }
    return camelize(record);
  }

  /* Validate whether the passed type is nested
     based on the model definition in Postgres

     @param {String} recordType
     @returns {Boolean}
  */
  validateType = function(recordType) {
    var sql = 'select coalesce((select count(*) > 0 '
                  + '           from only private.model '
                  + '             join private.nested on (model_id=nested_model_id) '
                  + '           where model_name = $1), false) as "isNested"',
        res = executeSql(sql, [ recordType ]);
    
    if(res[0].isNested) { 
      var msg = "The model for " + recordType + " is nested and may only be accessed in the context of a parent record.";
      throw new Error(msg); 
    }

    return true;
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

  // ..........................................................
  // PROCESS
  //

  var nameSpace = record_type.replace((/\.\w+/i),'').toLowerCase(), 
      recordType = record_type.replace((/\w+\./i),'').toLowerCase(), 
      debug = false, rec, 
      sql = "select * from " + nameSpace + '.' + recordType + " where guid = $1 ";  

  /* validate */
  validateType(recordType);

  /* query the model */
  if(debug) print(NOTICE, 'sql = ', sql);
  
  rec = executeSql(sql, [ id ]);

  /* return the results */
  return JSON.stringify(normalize(nameSpace, recordType, rec[0]));

$$ language plv8;
/*
select private.retrieve_record('XM.Contact', 3);
*/
