create or replace function xc.set_search_path() returns boolean as $$
  /* This is for use with connection pooling which wants to clear the search path */ 
  var path = plv8.execute('select buildSearchPath() as path')[0].path;
  plv8.execute('set search_path to ' + path);
  return true;
$$ language plv8