create or replace function private.install_orm(json text) returns void volatile as $$                                
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

  var newJson = JSON.parse(json), oldJson,
      oldOrm, sql, isExtension, sequence,
      orm_name = decamelize(newJson.type),
      orm_context = decamelize(newJson.context);

  if(!newJson.nameSpace) throw new Error("A name space is required");
  if(!orm_name) throw new Error("A type is required");
  if(!orm_context) throw new Error("A context is required");

  sql = 'select orm_id as "id", '
      + '  orm_json as "json", '
      + '  orm_ext as "isExtension" '
      + 'from private.orm '
      + 'where orm_name = $1 '
      + ' and orm_context = $2';

  oldOrm = executeSql(sql, [orm_name, orm_context])[0];

  sequence = newJson.sequence ? newJson.sequence : 0;
  isExtension = newJson.isExtension ? true : false;

  if(oldOrm) {
    oldJson = JSON.parse(oldOrm.json);
    if(oldJson.isSystem && !newJson.isSystem) throw new Error("A system map already exists for" + newJson.type);
    if(oldOrm.isExtension !== isExtension) throw new Error("Can not change extension status for " + newJson.type);
    
    sql = 'update private.orm set '
        + ' orm_json = $1, '
        + ' orm_seq = $2 '
        + 'where orm_id = $3';

    executeSql(sql, [json, sequence, oldOrm.id]);   
  } else { 
    sql = 'insert into private.orm ( orm_name, orm_context, orm_json, orm_seq, orm_ext ) values ( $1, $2, $3, $4, $5 )';

    executeSql(sql, [orm_name, orm_context, json, sequence, isExtension ]); 
  }
  
$$ language plv8;
