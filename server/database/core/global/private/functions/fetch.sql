create or replace function private.fetch(record_type text, query text default null, row_limit integer default null, row_offset integer default null) returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
     
  var nameSpace = record_type.replace((/\.\w+/i),'').toLowerCase(),
      model = record_type.replace((/\w+\./i),'').toLowerCase(),
      conditions = JSON.parse(query).conditions,
      orderBy = JSON.parse(query).orderBy ? 'order by ' + JSON.parse(query).orderBy : '',
      parameters = JSON.parse(query).parameters,
      limit = row_limit ? 'limit ' + row_limit : '';
      offset = row_offset ? 'offset ' + row_offset : '';
      debug = false, recs = null, 
      sql = "select * from {table} where {clause} {orderBy} {limit} {offset}",
      viewdefSql = "select attname, typname, typcategory "
                 + "from pg_class c, pg_namespace n, pg_attribute a, pg_type t "
                 + "where c.relname = $1 "
                 + " and n.nspname = $2 "
                 + " and n.oid = c.relnamespace "
                 + " and a.attnum > 0 "
                 + " and a.attrelid = c.oid "
                 + " and a.atttypid = t.oid ";

  // ..........................................................
  // METHODS
  //

  /* Returns an the first item in an array with a property matching the passed value.  

     @param { object } an array to search
     @param { string } property name to search on
     @param { any } a value to match
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

     @param { string | object }
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

     @param { string | object }
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

  /* Process array columns as changesets 
  
     @param { Object } record object to be committed
     @param { Object } view definition object
  */
  retrieveArrays = function(record, viewdef) {
    for(var prop in record) {
      if (record.hasOwnProperty(prop)) {
        var coldef = findProperty(viewdef, 'attname', prop),
	    value, result, sql = '';

          if (coldef['typcategory'] === "A" && record[prop] !== null) {
            var key = coldef['typname'].substring(1);

	  for (var i = 0; i < record[prop].length; i++) {
	    var value = record[prop][i];

	    sql = "select (cast('" + value + "' as " + nameSpace + "." + key + ")).*";

	    if(debug) print(NOTICE, 'sql: ', sql);

	    result = executeSql(sql);

	    for (var k = 0; k < result.length; k++) {
	      record[prop][i] = retrieveArrays(result[k], executeSql(viewdefSql, [key, nameSpace]));
	    }
          }
        }
      }
    }
    return camelize(record);
  }

  buildClause = function(conditions, parameters) {
    var ret = ' true ';
    
    if(conditions) {
      /* replace special operators */
      ret = decamelize(conditions.replace('STARTS_WITH','~^')
                                 .replace('ENDS_WITH','~?')
                                 .replace('CONTAINS','~')
                                 .replace('MATCHES','~')
                                 .replace('ANY', '<@ array'));

      quoteIfString = function(arg) { 
        if(typeof arg === 'string') { 
          return "'" + arg + "'"; 
        }

        return arg;
      }
      
      if(parameters) {
        if(ret.indexOf('%@') > 0) {  /* replace wild card tokens */
          for(var prop in parameters) {
            var n = ret.indexOf('%@'),
                val =  quoteIfString(parameters[prop]);

            ret = ret.slice(0, n) + val + ret.slice(n + 2);
          }
        } else {  /* replace parameterized tokens */
          for(var prop in parameters) {
            var param = '{' + decamelize(prop) + '}',
                val = quoteIfString(parameters[prop]);
            
            ret = ret.replace(param, val);
          }
        }
      }
    }
    return ret;
  }

  // ..........................................................
  // PROCESS
  //

  /* query the model */
  sql = sql.replace('{table}', nameSpace + '.' + model)
           .replace('{clause}', buildClause(conditions, parameters))
           .replace('{orderBy}', decamelize(orderBy))
           .replace('{limit}', limit)
           .replace('{offset}', offset);
           
  if(debug) { print(NOTICE, 'sql = ', sql); }

  recs = executeSql(sql);

  /* convert the child arrays */
  if(debug) { print(NOTICE, 'viewdefSql = ', viewdefSql) };

  viewdef = executeSql(viewdefSql, [ model, nameSpace ]);

  for (var i = 0; i < recs.length; i++) {
    recs[i] = retrieveArrays(recs[i], viewdef);
  };
 
  /* return the results */
  return JSON.stringify(recs);

$$ language plv8;
/*
select private.fetch('XM.Contact',E'{"parameters":{ 
                                       "firstName": "Jake", 
                                       "lastName": "F"
                                     }, 
                                     "conditions":"firstName = {firstName} OR lastName STARTS_WITH {lastName}", 
                                     "orderBy":"lastName"}', 3);

select private.fetch('XM.Contact',E'{"parameters":{ 
                                       "firstName": "Jake", 
                                       "lastName": "F"
                                     }, 
                                     "conditions":"firstName = %@ OR lastName STARTS_WITH %@", 
                                     "orderBy":"lastName"}', 3);
*/