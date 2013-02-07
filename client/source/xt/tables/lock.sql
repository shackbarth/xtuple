-- table definition

select xt.create_table('lock');
select xt.add_column('lock','lock_id', 'serial', 'primary key');
select xt.add_column('lock','lock_table_oid', 'integer', 'not null');
select xt.add_column('lock','lock_record_id', 'integer', 'not null');
select xt.add_column('lock','lock_username', 'text', 'not null');
select xt.add_column('lock','lock_acquired', 'timestamp', 'not null');
select xt.add_column('lock','lock_pid', 'integer');

comment on table xt.lock is 'Keep track of record-level locks for both web and QT client';
