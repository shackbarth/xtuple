--drop function private.retrieve_records(text, integer[])
create or replace function private.retrieve_records(record_type text, ids integer[] default '{}') returns text as $$
  /* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
     See www.xm.ple.com/CPAL for the full text of the software license. */
     
  var nameSpace = record_type.replace((/\.\w+/i),'').toLowerCase(), 
      model = record_type.replace((/\w+\./i),'').toLowerCase(), 
      debug = false, recs, 
      sql = "select * from " + nameSpace + '.' + model + " where ", 
      viewdefSql = "select attnum, attname, typname, typcategory "
		 + "from pg_class c, pg_namespace n, pg_attribute a, pg_type t "
		 + "where c.relname = $1 "
		 + "and n.nspname = $2 "
		 + "and n.oid = c.relnamespace "
		 + "and a.attnum > 0 "
		 + "and a.attrelid = c.oid "
		 + "and a.atttypid = t.oid "
		 + "order by attnum";

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

  /* Process array columns as changesets 
  
     @param { Object } record object to be committed
     @param { Object } view definition object
  */
  retrieveArrays = function(record, viewdef) {
    if(debug) print(NOTICE, 'retrieveArrays(' + record + ', ' + viewdef + ') entered ', '');

    for(var prop in record) {

      if (record.hasOwnProperty(prop)) {

	 var coldef = findProperty(viewdef, 'attname', prop),

	     value, result, sql = '';

        if (coldef['typcategory'] === "A" && record[prop] !== null) {

          var key = coldef['typname'].substring(1);

	  for (var i = 0; i < record[prop].length; i++) {

	    value = record[prop][i];

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

    
    if(debug) print(NOTICE, 'retrieveArrays(' + record + ', ' + viewdef + ') returning ', '');
    return camelize(record);
  }

  // ..........................................................
  // PROCESS
  //

  /* query the model */
  if(ids.length) { 
    sql = sql.concat("guid in (", ids.join(','), ")");
  } else {
    sql = sql.concat('true');
  };

  if(debug) print(NOTICE, 'sql = ', sql);
  
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
select private.retrieve_records('XM.Project', '{}');
*/
