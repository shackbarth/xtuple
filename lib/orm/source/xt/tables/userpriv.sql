-- table definition

select xt.create_table('userpriv');
select xt.add_column('userpriv','userpriv_id', 'serial', 'primary key');
select xt.add_column('userpriv','userpriv_priv_id', 'integer');
select xt.add_column('userpriv','userpriv_username', 'text');
select xt.add_constraint('userpriv', 'userpriv_userpriv_priv_id_fkey','foreign key (userpriv_priv_id) references xt.priv (priv_id)');

comment on table xt.userpriv is 'Core table for User Privilege Assignments';
