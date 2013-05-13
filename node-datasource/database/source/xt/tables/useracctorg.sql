-- table definition

select xt.create_table('useracctorg');
select xt.add_column('useracctorg','useracctorg_id', 'serial', 'primary key');
select xt.add_column('useracctorg','useracctorg_usr_id', 'text', 'references xt.useracct (useracct_id)');
select xt.add_column('useracctorg','useracctorg_org_name', 'text', 'references xt.org (org_name)');
select xt.add_column('useracctorg','useraccrrorg_username', 'text');
select xt.add_constraint('useracctorg','useracctorg_useracctorg_usr_id_useracctorg_org_name', 'unique (usrracctorg_usr_id, useracctorg_org_name)');

comment on table xt.usrorg is 'Maps organization user accounts assignments and organizations to users';
