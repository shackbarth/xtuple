create or replace function xt.trylock(oid integer, id integer) returns boolean as $$
  var pid = plv8.execute("select pg_backend_pid() as pid;")[0].pid,
    data = Object.create(XT.Data),
    lock = data.tryLock(oid, id, {pid: pid});
    
  return lock.key ? true : false;
  
$$ language plv8;
