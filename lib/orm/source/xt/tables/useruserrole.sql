-- table definition

select xt.create_table('useruserrole');
select xt.add_column('useruserrole','useruserrole_id', 'serial', 'primary key');
select xt.add_column('useruserrole','useruserrole_userrole_id', 'integer');
select xt.add_column('useruserrole','useruserrole_username', 'text');
select xt.add_constraint('useruserrole',
  'useruserrole_userrole_id_fkey',
  'foreign key (useruserrole_userrole_id) references xt.userrole (userrole_id)');

comment on table xt.useruserrole is 'Core table for User to User Role Assignments';
