-- table definition

select xt.create_table('useracctorg');
select xt.add_column('useracctorg','useracctorg_id', 'serial', 'primary key');
select xt.add_column('useracctorg','useracctorg_useracct_id', 'integer', 'references xt.useracct (useracct_id)');
select xt.add_column('useracctorg','useracctorg_org_id', 'integer', 'references xt.org (org_id)');
select xt.add_constraint('useracctorg','useracctorg_useracctorg_usr_id_useracctorg_org_name', 'unique (useracctorg_useracct_id, useracctorg_org_name)');

comment on table xt.usrorg is 'Maps organization user accounts assignments and organizations to users';
