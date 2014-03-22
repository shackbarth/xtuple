select xt.create_table('prjtypeext');

select xt.add_column('prjtypeext','prjtypeext_id', 'integer', 'primary key');
select xt.add_column('prjtypeext','prjtypeext_emlprofile_id', 'integer');

comment on table xt.prjtypeext is 'Project type extension table';
