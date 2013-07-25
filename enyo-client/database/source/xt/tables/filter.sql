select xt.create_table('filter');

select xt.add_column('filter','filter_id', 'serial', 'primary key');
select xt.add_column('filter','obj_uuid', 'text', 'default xt.generate_uuid()', 'xt');
select xt.add_column('filter','filter_createdby', 'text');
select xt.add_column('filter','filter_name', 'text');
select xt.add_column('filter','filter_shared', 'boolean');
select xt.add_column('filter','filter_params', 'text');

comment on table xt.filter is 'Saved filter parameters for advanced search';
