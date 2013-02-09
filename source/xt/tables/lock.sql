-- table definition

select xt.create_table('lock');
select xt.add_column('lock','lock_id', 'bigserial', 'primary key');
select xt.add_column('lock','lock_table_oid', 'integer', 'not null');
select xt.add_column('lock','lock_record_id', 'integer', 'not null');
select xt.add_column('lock','lock_username', 'text', 'not null');
select xt.add_column('lock','lock_effective', 'timestamp with time zone', 'not null default now()');
select xt.add_column('lock','lock_expires', 'timestamp with time zone', 'not null');
select xt.add_column('lock','lock_pid', 'integer');

select xt.add_index('lock', 'lock_table_oid, lock_record_id', 'lock_index');

comment on table xt.lock is 'Keep track of record-level locks for both web and QT client';
