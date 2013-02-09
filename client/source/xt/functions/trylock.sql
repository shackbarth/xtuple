create or replace function xt.trylock(oid integer, id integer) returns boolean as $$
  var pid = plv8.execute("select pg_backend_pid() as pid;")[0].pid,
    username = plv8.execute("select geteffectivextuser() as username;")[0].username,
    data = Object.create(XT.Data);
    
  return data.tryLock(oid, id, username, {pid: pid});
  
$$ language plv8;
