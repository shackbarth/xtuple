drop view if exists xt.share_users cascade;

-- placeholder view

create view xt.share_users as
select
  null::uuid as obj_uuid,
  null::text as username;

select dropIfExists('TRIGGER', 'sharetype_did_change', 'xt');

-- table definition

select xt.create_table('sharetype', 'xt');
select xt.add_column('sharetype','sharetype_id', 'serial', 'primary key', 'xt');
select xt.add_column('sharetype','sharetype_nsname', 'text');
select xt.add_column('sharetype','sharetype_tblname', 'text');
select xt.add_column('sharetype','sharetype_col_obj_uuid', 'text');
select xt.add_column('sharetype','sharetype_col_username', 'text');

select xt.add_constraint('sharetype','sharetype_unique', 'unique(sharetype_nsname, sharetype_tblname, sharetype_col_obj_uuid, sharetype_col_username)');

comment on table xt.sharetype is 'Share User Type Map';

-- create trigger

create trigger sharetype_did_change after insert or update or delete on xt.sharetype for each row execute procedure xt.sharetype_did_change();

delete from xt.sharetype;

-- Default shared access grants.
insert into xt.sharetype (
  sharetype_nsname,
  sharetype_tblname,
  sharetype_col_obj_uuid,
  sharetype_col_username
) values (
  'xt',
  'share_users_default',
  'obj_uuid',
  'username'
);
