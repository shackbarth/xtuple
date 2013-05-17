select xt.create_table('usrext');

select xt.add_column('usrext','usrext_id', 'serial', 'primary key');
select xt.add_column('usrext','usrext_usr_username', 'text');
select xt.add_column('usrext','usrext_ext_id', 'integer', 'references xt.ext (ext_id)');

comment on table xt.bicache is 'Associations of users with extensions';
