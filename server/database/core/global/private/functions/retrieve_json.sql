drop function private.retrieveJson(text, integer);

create or replace function private.retrieveJson(pmodel text, pguid integer default null) returns text as $$

  var nameSpace = pmodel.replace((/\.\w+/i),'').toLowerCase(), model = pmodel.replace((/\w+\./i),''),

      modelDefQuery = "select attnum, attname, typname, typcategory "
			  + "from pg_class c, pg_namespace n, pg_attribute a, pg_type t "
			  + "where c.relname = $1 "
			  + "and n.nspname = $2 "
			  + "and n.oid = c.relnamespace "
			  + "and a.attnum > 0 "
			  + "and a.attrelid = c.oid "
			  + "and a.atttypid = t.oid "
			  + "order by attnum";

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

/* 
    Pass an argument to change names with underscores '_' camel case.
    A string passed in simply returns a camelized string.
    If an object is passed, an object is returned with all it's
    proprety names camelized.

@param { string | object }
*/

 camelize = function(arg) {

   var ret = arg; 

   camelizeStr = function(str) {

     var rtn = str.replace((/([\s|\-|\_|\n])([^\s|\-|\_|\n]?)/g), function(str, separater, character) {

      return character ? character.toUpperCase() : '';

    });

    var first = rtn.charAt(0),

        lower = first.toLowerCase();

    return first !== lower ? lower + ret.slice(1) : rtn;

   };

   if(typeof arg == "string") {

     ret = camelizeStr(arg);

   }

   else if(typeof arg == "object") {

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

    for(prop in record) {

      var coldef = findProperty(viewdef, 'attname', prop);

      if (coldef['typcategory'] === 'A' && record[prop].toString() !== '') {

        var key = coldef['typname'].substring(1); /* strip underscore from (array) type name */

        for (var i in record[prop]) {

          var value = record[prop][i];

          assignTypeQry = "select (cast('" + value + "' as " + nameSpace + "." + key + ")).*";

          var result = executeSql(assignTypeQry);

          record[prop][i] = camelize(result[0]);

        }
      }
    }

    return camelize(record);

  }

  var modelQuery = 'select * from ' + pmodel;

  if(pguid !== null) {

    modelQuery += ' where guid = ' + pguid;

  };

  var modelRecs = executeSql(modelQuery);

  var modelDefRecs = executeSql(modelDefQuery, [ model, nameSpace ]);

  for (var i = 0; i < modelRecs.length; i++) {

    modelRecs[i] = retrieveArrays(modelRecs[i], modelDefRecs);

  };

  return JSON.stringify(modelRecs);

$$ language plv8;

select private.retrieveJson('XM.opportunity');