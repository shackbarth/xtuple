select xt.create_table('fltr');

select xt.add_column('fltr','fltr_id', 'serial', 'primary key');
select xt.add_column('fltr','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'xt');
select xt.add_column('fltr','fltr_createdby', 'text');
select xt.add_column('fltr','fltr_name', 'text');
select xt.add_column('fltr','fltr_type', 'text');
select xt.add_column('fltr','fltr_shared', 'boolean');
select xt.add_column('fltr','fltr_params', 'text');
select xt.add_column('fltr','fltr_param_kind', 'text');

comment on table xt.fltr is 'Saved filter parameters for advanced search';
