-- table definition

select xt.create_table('obj_share');
select xt.add_column('obj_share', 'obj_share_target_id', 'integer', 'not null', 'xt', 'Database id of the target record.');
select xt.add_column('obj_share', 'obj_share_type', 'text', 'not null', 'xt', 'The type of record.');
select xt.add_column('obj_share', 'obj_share_user', 'text', 'not null', 'xt', 'The PostgreSQL username.');
select xt.add_column('obj_share', 'obj_share_read', 'bool', 'not null default false', 'xt', 'Grant read access flag.');
select xt.add_column('obj_share', 'obj_share_update', 'bool', 'not null default false', 'xt', 'Grant update access flag.');
select xt.add_column('obj_share', 'obj_share_delete', 'bool', 'not null default false', 'xt', 'Grant delete access flag.');
select xt.add_column('obj_share', 'obj_share_grant_date', 'timestamp with time zone', 'not null default now()', 'xt', 'Timestamp when access was granted.');
select xt.add_column('obj_share', 'obj_share_update_date', 'timestamp with time zone', 'not null default now()', 'xt', 'Timestamp when access was updated.');

select xt.add_constraint('obj_share','obj_share_unique', 'unique (obj_share_target_id, obj_share_type, obj_share_user)', 'xt');

select xt.add_index('obj_share', 'obj_share_target_id, obj_share_type', 'obj_share_index');
select xt.add_index('obj_share', 'obj_share_type', 'obj_share_type_index');
select xt.add_index('obj_share', 'obj_share_user', 'obj_share_user_index');

comment on table xt.lock is 'Keep track of record-level personal privilege access grants.';

grant all on xt.obj_share to xtrole;
