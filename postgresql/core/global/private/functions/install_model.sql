create or replace function private.install_model(json text) returns void volatile as $$                                
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

  var newModel = JSON.parse(json),
      oldModel, sql,
      model_name = decamelize(newModel.type);

  sql = 'select model_id as "id", model_json as "json" '
      + 'from private.modelbas '
      + 'where model_name = $1 ';

  oldModel = executeSql(sql, [model_name])[0];

  if(oldModel) {
    if(JSON.parse(oldModel.json).isSystem && !newModel.isSystem) throw new Error("A system model already exists for" + newModel.type);
    
    sql = 'update private.modelbas set model_json = $2 where model_name = $1';  
  } else { 
    sql = 'insert into private.modelbas ( model_name, model_json ) values ( $1, $2 )';
  }

  executeSql(sql, [model_name, json]); 
  
$$ language plv8;
