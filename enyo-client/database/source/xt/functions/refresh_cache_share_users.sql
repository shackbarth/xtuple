create or replace function xt.refresh_share_user_cache() returns boolean as $$
  var deleteSql = 'delete from xt.cache_share_users',
    refreshSQL = 'insert into xt.cache_share_users (uuid, username) select obj_uuid, username from xt.share_users group by obj_uuid, username',
    reindexSQL = 'reindex table xt.cache_share_users';

  plv8.execute(deleteSql);
  plv8.execute(refreshSQL);
  plv8.execute(reindexSQL);

  return true;

$$ language plv8;
