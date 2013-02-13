-- table definition

select xt.create_table('usrorg');
select xt.add_column('usrorg','usrorg_id', 'serial', 'primary key');
select xt.add_column('usrorg','usrorg_usr_id', 'text', 'references xt.usr (usr_id)');
select xt.add_column('usrorg','usrorg_org_name', 'text', 'references xt.org (org_name)');
select xt.add_column('usrorg','usrorg_username', 'text');
select xt.add_constraint('usrorg','usrorg_usrorg_usr_id_usrorg_org_name', 'unique (usrorg_usr_id, usrorg_org_name)');

comment on table xt.usrorg is 'Maps organization user accounts assignments and organizations to global users';
