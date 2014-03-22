select xt.create_table('clientcode');

select xt.add_column('clientcode','clientcode_id', 'serial', 'primary key');
select xt.add_column('clientcode','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()');
select xt.add_column('clientcode','clientcode_code', 'text');
select xt.add_column('clientcode','clientcode_ext_id', 'int', 'references xt.ext (ext_id)');
select xt.add_column('clientcode','clientcode_version', 'text');
select xt.add_column('clientcode','clientcode_language', 'text');

comment on table xt.clientcode is 'Code to be served to the client';

