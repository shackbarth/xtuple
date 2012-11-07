-- table definition

select xt.create_table('grppriv');
select xt.add_column('grppriv','grppriv_id', 'serial', 'primary key');
select xt.add_column('grppriv','grppriv_grp_id', 'integer', 'not null');
select xt.add_column('grppriv','grppriv_priv_id', 'integer', 'not null');
select xt.add_constraint('grppriv', 'grppriv_grppriv_grp_id_fkey','foreign key (grppriv_grp_id) references grp (grp_id)');
select xt.add_constraint('grppriv', 'grppriv_grppriv_priv_id_fkey','foreign key (grppriv_priv_id) references priv (priv_id)');

comment on table xt.usrpriv is 'Core table for Group Role Privilege Assignments';
