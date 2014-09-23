create or replace function xt.trylock(oid integer, id integer) returns boolean as $$
  var sql = "select public.trylock($1, $2) as result;";
  return plv8.execute(sql, [oid, id])[0].result;
  /* temporary: let qt client use advisory locks but web client use xt.lock */

  var pid = plv8.execute("select pg_backend_pid() as pid;")[0].pid,
    data = Object.create(XT.Data),
    lock = data.tryLock(oid, id, {pid: pid});
    
  return lock.key ? true : false;
  
$$ language plv8;
