-- table definition

select xt.create_table('usrorg');
select xt.add_column('usrorg','usrorg_id', 'serial', 'primary key');
select xt.add_column('usrorg','usrorg_usr_id', 'integer', 'references xt.usr (usr_id)');
select xt.add_column('usrorg','usrorg_org_id', 'integer', 'references xt.org (org_id)');
select xt.add_constraint('usrorg','usrorg_usrorg_usr_id_usrorg_org_id', 'unique (usrorg_usr_id, usrorg_org_id)');

comment on table xt.usrorg is 'Defines global user assignments to organizations';
