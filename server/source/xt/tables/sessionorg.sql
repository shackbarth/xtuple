-- table definition

select xt.create_table('sessionorg');
select xt.add_column('sessionorg','sessionorg_id', 'serial', 'primary key');
select xt.add_column('sessionorg','sessionorg_session_sid', 'text', 'references xt.session (session_sid) on delete cascade');
select xt.add_column('sessionorg','sessionorg_org_name', 'text', 'references xt.org (org_name) on delete cascade');
select xt.add_column('sessionorg','sessionorg_usr_id', 'text', 'references xt.usr (usr_id) on delete cascade');

comment on table xt.usrorg is 'Defines global user organization assignments to sessions';
