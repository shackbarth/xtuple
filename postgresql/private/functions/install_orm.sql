create or replace function private.install_orm(json text) returns void volatile as $$                                
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

  /* initialize plv8 if needed */
  if(!this.isInitialized) executeSql('select private.init_js()');

  var newJson = JSON.parse(json), oldJson,
      oldOrm, sql, isExtension, sequence,
      nameSpace = newJson.nameSpace,
      type = newJson.type,
      context = newJson.context,
      sql;

  if(!nameSpace) throw new Error("A name space is required");
  if(!type) throw new Error("A type is required");
  if(!context) throw new Error("A context is required");

  sql = 'select orm_id as "id", '
      + '  orm_json as "json", '
      + '  orm_ext as "isExtension" '
      + 'from private.orm '
      + 'where orm_namespace = $1 '
      + ' and orm_type = $2 '
      + ' and orm_context = $3';

  oldOrm = executeSql(sql, [nameSpace, type, context])[0];

  sequence = newJson.sequence ? newJson.sequence : 0;
  isExtension = newJson.isExtension ? true : false;

  if(oldOrm) {
    oldJson = JSON.parse(oldOrm.json);
    if(oldJson.isSystem && !newJson.isSystem) throw new Error("A system map already exists for" + nameSpace + '.' + type);
    if(oldOrm.isExtension !== isExtension) throw new Error("Can not change extension state for " + nameSpace + '.' + type);
    
    sql = 'update private.orm set '
        + ' orm_json = $1, '
        + ' orm_seq = $2 '
        + 'where orm_id = $3';

    executeSql(sql, [json, sequence, oldOrm.id]);   
  } else { 
    sql = 'insert into private.orm ( orm_namespace, orm_type, orm_context, orm_json, orm_seq, orm_ext ) values ($1, $2, $3, $4, $5, $6)';

    executeSql(sql, [nameSpace, type, context, json, sequence, isExtension]); 
  }
  
$$ language plv8;
