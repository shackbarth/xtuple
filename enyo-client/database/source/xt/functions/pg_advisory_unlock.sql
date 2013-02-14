create or replace function xt.pg_advisory_unlock(oid integer, id integer) returns boolean as $$
  var pid = plv8.execute("select pg_backend_pid() as pid;")[0].pid,
    username = plv8.execute("select geteffectivextuser() as username;")[0].username,
    sql = "select * from xt.lock where lock_table_oid = $1 and lock_record_id = $2 and lock_username = $3 and lock_pid = $4;",
    data = Object.create(XT.Data),
    query = plv8.execute(sql, [oid, id, username, pid]);

  if (query.length) {
    data.releaseLock({key: query[0].lock_id});
    return true;
  }
  return false;
  
$$ language plv8;
