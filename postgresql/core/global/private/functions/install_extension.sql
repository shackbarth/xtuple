create or replace function private.extend_model(json text) returns void volatile as $$
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

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

  var newExt = JSON.parse(json),
      context = decamelize(newExt.context),
      name = decamelize(newExt.name),
      oldExt, sql;
  
  sql = 'select model_id as "id", model_system as "isSystem" '
      + 'from private.modelext '
      + 'where modelext_context = $1 '
      + ' and model_name = $1 ';

  oldExt = executeSql(sql, [ context, name,  ])[0];
  
  if(oldExt) {
    if(oldExt.isSystem && !newExt.isSystem) throw new Error("A system extension already exists for" + newExt.context + ' ' + newExt.type);
    
    sql = 'update private.modelext set '
        + ' model_json = $1, '
        + ' modelext_seq = $2 '
        + 'where model_id = $3';

    executeSql(sql, [json, newExt.sequence, oldExt.id,]);
  } else {
    sql = 'insert into private.modelext ( modelext_context, model_name,  modelext_seq, model_json ) values ( $1, $2, $3, $4 )';

    executeSql(sql, [context, name, newExt.sequence, json]); 
  }
  
$$ language plv8;
