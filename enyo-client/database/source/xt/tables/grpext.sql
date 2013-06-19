select xt.create_table('grpext');

select xt.add_column('grpext','grpext_id', 'serial', 'primary key');
select xt.add_column('grpext','obj_uuid', 'text', 'default xt.generate_uuid()', 'xt');
select xt.add_column('grpext','grpext_grp_id', 'integer', 'references grp (grp_id)');
select xt.add_column('grpext','grpext_ext_id', 'integer', 'references xt.ext (ext_id)');

comment on table xt.bicache is 'Associations of groups with extensions';
