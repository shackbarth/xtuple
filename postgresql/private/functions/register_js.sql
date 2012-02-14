create or replace function private.register_js(namespace text, type text, context text, require text, is_extension boolean default false) returns void as $$                                
/* Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
   See www.xm.ple.com/CPAL for the full text of the software license. */

  if(!namespace) throw new Error("A name space is required");
  if(!type) throw new Error("A type is required");
  if(!context) throw new Error("A context is required");

  sql = 'select js_id as "id", '
      + ' js_ext as "isExtension" '
      + 'from private.js '
      + 'where js_namespace = $1 '
      + ' and js_type = $2 '
      + ' and js_context = $3';

  js = executeSql(sql, [namespace, type, context])[0];

  if(js) {
    if(js.isExtension !== is_extension) throw new Error("Can not change extension state for {namespace}.{type} in context {context}."
                                                        .replace(/{namespace}/, namespace)
                                                        .replace(/{type}/, type)
                                                        .replace(/{context}/, context));
    
    sql = 'update private.js set '
        + ' js_require = $1 '
        + 'where js_id = $2';

    executeSql(sql, [require, js.id]);   
  } else { 
    sql = 'insert into private.js ( js_namespace, js_type, js_context, js_require, js_ext ) values ($1, $2, $3, $4, $5)';

    executeSql(sql, [namespace, type, context, require, is_extension]); 
  }
  
$$ language plv8;
