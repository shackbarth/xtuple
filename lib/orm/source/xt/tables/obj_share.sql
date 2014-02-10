-- table definition

select xt.create_table('obj_share');
select xt.add_column('obj_share','obj_share_id', 'bigserial', 'primary key');
select xt.add_column('obj_share', 'obj_share_target_uuid', 'uuid', 'not null', 'xt', 'The UUID of the record object being shared with this user.');
select xt.add_column('obj_share', 'obj_share_username', 'text', 'not null', 'xt', 'The PostgreSQL username with shared access.');
select xt.add_column('obj_share', 'obj_share_read', 'bool', 'not null default false', 'xt', 'Grant read access flag.');
select xt.add_column('obj_share', 'obj_share_update', 'bool', 'not null default false', 'xt', 'Grant update access flag.');
select xt.add_column('obj_share', 'obj_share_delete', 'bool', 'not null default false', 'xt', 'Grant delete access flag.');
select xt.add_column('obj_share', 'obj_share_created', 'timestamp with time zone', 'not null default now()', 'xt', 'Timestamp when access was created.');
select xt.add_column('obj_share', 'obj_share_updated', 'timestamp with time zone', 'not null default now()', 'xt', 'Timestamp when access was updated.');

/* Cleans up old xt.obj uuid installs and converts them from data type text to uuid. */
DO $$
  var obj;

  obj = plv8.execute("select data_type from information_schema.columns where table_schema = 'xt' and table_name = 'obj' and column_name = 'obj_uuid';");

  if (obj.length) {
    /* Support upgrading old installs without the obj uuid type change. */
    if (obj[0].data_type === 'text') {
      plv8.execute("select xt.add_column('obj_share', 'obj_uuid', 'text', 'not null default xt.uuid_generate_v4()', 'xt', 'The UUID of this share record.');");
    } else {
      plv8.execute("select xt.add_column('obj_share', 'obj_uuid', 'uuid', 'not null default xt.uuid_generate_v4()', 'xt', 'The UUID of this share record.');");
    }
  }
$$ language plv8;

select xt.add_inheritance('xt.obj_share', 'xt.obj');

select xt.add_constraint('obj_share','obj_share_uuid_id', 'unique (obj_uuid)', 'xt');
select xt.add_constraint('obj_share','obj_share_unique_share', 'unique (obj_share_target_uuid, obj_uuid, obj_share_username)', 'xt');

select xt.add_index('obj_share', 'obj_share_target_uuid', 'obj_share_target_uuid_index');
select xt.add_index('obj_share', 'obj_uuid', 'obj_share_obj_uuid_index');
select xt.add_index('obj_share', 'obj_share_username', 'obj_share_username_index');

comment on table xt.obj_share is 'Keep track of record-level personal privilege access grants.';

grant all on xt.obj_share to xtrole;
grant usage, select on sequence xt.obj_share_obj_share_id_seq to xtrole;
