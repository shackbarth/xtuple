-- Table definition.
select xt.create_table('cache_share_users', 'xt');
select xt.add_column('cache_share_users','uuid', 'uuid', null, 'xt', 'Object UUID the username has access to.');
select xt.add_column('cache_share_users','username', 'text', null, 'xt', 'The username that has access to the object.');

select xt.add_constraint('cache_share_users','cache_share_users_unique', 'unique(uuid, username)');

comment on table xt.sharetype is 'Cache table for xt.share_user';

-- Indexes.
select xt.add_index('cache_share_users', 'uuid', 'cache_share_users_uuid_idx', 'btree', 'xt');
select xt.add_index('cache_share_users', 'username', 'cache_share_users_username_idx', 'btree', 'xt');

-- Clear table when rebuilding. It will be populated when the datasource starts.
delete from xt.cache_share_users;
reindex table xt.cache_share_users;
