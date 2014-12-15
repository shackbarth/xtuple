create or replace function xt.refresh_cache_share_users_user(username text) returns boolean as $$
  var insertSQL = 'insert into xt.cache_share_users (uuid, username) ' +
                  'select obj_uuid, username from xt.share_users ' +
                  'where username = $1 ' +
                  'group by obj_uuid, username',
    deleteSQL = 'delete from xt.cache_share_users where username = $1';

  /*
   * Share Users access that are derrived through relations query the
   * xt.share_users view to get the current share relation. To refresh the
   * cache, we delete any existing shares for this object and then insert the
   * latest from xt.share_users.
   */
  if (username) {
    plv8.execute(deleteSQL, [username]);
    plv8.execute(insertSQL, [username]);
  }

  return true;

$$ language plv8;
