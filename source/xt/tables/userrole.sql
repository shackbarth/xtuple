-- table definition

select xt.create_table('userrole');
select xt.add_column('userrole','userrole_id', 'serial', 'primary key');
select xt.add_column('userrole','userrole_name', 'text');
select xt.add_column('userrole','userrole_descrip', 'text');

comment on table xt.userrole is 'Core table for Privilege Group Roles';
