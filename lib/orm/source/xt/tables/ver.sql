-- table definition

select xt.create_table('ver');
select xt.add_column('ver','ver_id', 'bigserial', 'primary key');
select xt.add_column('ver','ver_table_oid', 'integer', 'not null');
select xt.add_column('ver','ver_record_id', 'integer', 'not null');
select xt.add_column('ver','ver_version', 'integer', 'not null');

select xt.add_index('ver', 'ver_table_oid, ver_record_id', 'ver_index');

comment on table xt.ver is 'Keep track of object versions ';

grant all on xt.ver to xtrole;
grant all on xt.ver_ver_id_seq to xtrole;
