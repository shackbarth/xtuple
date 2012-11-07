-- table definition

select xt.create_table('grp');
select xt.add_column('grp','grp_id', 'serial', 'primary key');
select xt.add_column('grp','grp_name', 'text');
select xt.add_column('grp','grp_descrip', 'text');

comment on table xt.grp is 'Core table for Privilege Group Roles';
