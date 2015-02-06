select xt.install_js('XT','Init','xtuple', $$

 /* Set search path based on xTuple logic */
 var searchPath = plv8.execute('select buildsearchpath() as path')[0].path,
   sql = 'set search_path to ' + searchPath;
 plv8.execute(sql);
$$ );