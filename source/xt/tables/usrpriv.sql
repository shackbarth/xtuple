-- table definition

select xt.create_table('usrpriv');
select xt.add_column('usrpriv','usrpriv_id', 'serial', 'primary key');
select xt.add_column('usrpriv','usrpriv_priv_id', 'integer');
select xt.add_column('usrpriv','usrpriv_username', 'text');
select xt.add_constraint('usrpriv', 'usrpriv_usrpriv_priv_id_fkey','foreign key (usrpriv_priv_id) references priv (priv_id)');

comment on table xt.usrpriv is 'Core table for User Privilege Assignments';
