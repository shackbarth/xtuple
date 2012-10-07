create or replace function xt.install_js(name_space text, type_name text, context text, javascript text, is_extension boolean default false) returns void as $$                                

  if(!name_space) throw new Error("A name space is required");
  if(!type_name) throw new Error("A type is required");
  if(!context) throw new Error("A context is required");

  sql = 'select js_id as "id", '
      + ' js_ext as "isExtension" '
      + 'from xt.js '
      + 'where js_namespace = $1 '
      + ' and js_type = $2 '
      + ' and js_context = $3';

  js = plv8.execute(sql, [name_space, type_name, context])[0];

  if(js) {
    if(js.isExtension !== is_extension) throw new Error("Can not change extension state for {namespace}.{type} in context {context}."
                                                        .replace(/{namespace}/, name_space)
                                                        .replace(/{type}/, type_name)
                                                        .replace(/{context}/, context));
    
    sql = 'update xt.js set '
        + ' js_text = $1 '
        + 'where js_id = $2';

    plv8.execute(sql, [javascript, js.id]);   
  } else { 
    sql = 'insert into xt.js ( js_namespace, js_type, js_context, js_text, js_ext ) values ($1, $2, $3, $4, $5)';

    plv8.execute(sql, [name_space, type_name, context, javascript, is_extension]); 
  }
  
$$ language plv8;
