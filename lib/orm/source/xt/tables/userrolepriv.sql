-- table definition

select xt.create_table('userrolepriv');
select xt.add_column('userrolepriv','userrolepriv_id', 'serial', 'primary key');
select xt.add_column('userrolepriv','userrolepriv_userrole_id', 'integer', 'not null');
select xt.add_column('userrolepriv','userrolepriv_priv_id', 'integer', 'not null');
select xt.add_constraint('userrolepriv',
  'userrolepriv_userrolepriv_userrole_id_fkey',
  'foreign key (userrolepriv_userrole_id) references xt.userrole (userrole_id)');
select xt.add_constraint('userrolepriv',
  'userrolepriv_userrolepriv_priv_id_fkey',
  'foreign key (userrolepriv_priv_id) references xt.priv (priv_id)');

comment on table xt.userrolepriv is 'Core table for User Role Privilege Assignments';
