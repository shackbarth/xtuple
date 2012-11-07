-- table definition

select xt.create_table('dbserver');
select xt.add_column('dbserver','dbserver_id', 'serial', 'primary key');
select xt.add_column('dbserver','dbserver_name', 'text', 'unique');
select xt.add_column('dbserver','dbserver_hostname', 'text', 'unique');
select xt.add_column('dbserver','dbserver_port', 'text');
select xt.add_column('dbserver','dbserver_descrip', 'text');
select xt.add_column('dbserver','dbserver_loc', 'text');
select xt.add_column('dbserver','dbserver_created', 'timestamp with time zone');
select xt.add_column('dbserver','dbserver_username', 'text');
select xt.add_column('dbserver','dbserver_password', 'text');

comment on table xt.dbserver is 'Database Servers';
