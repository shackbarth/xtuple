-- table definition

select xt.create_table('ver');
select xt.add_column('ver','ver_id', 'bigserial', 'primary key');
select xt.add_column('ver','ver_table_oid', 'integer', 'not null');
select xt.add_column('ver','ver_record_id', 'integer', 'not null');
select xt.add_column('ver','ver_etag', 'uuid', 'not null');
select xt.add_constraint('ver', 'ver_ver_table_oid_ver_record_id', 'unique(ver_table_oid, ver_record_id)');

comment on table xt.ver is 'Keep track of object versions ';

grant all on xt.ver to xtrole;
grant all on xt.ver_ver_id_seq to xtrole;
