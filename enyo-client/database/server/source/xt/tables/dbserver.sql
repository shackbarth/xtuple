-- table definition

select xt.create_table('dbserver');
select xt.add_column('dbserver','dbserver_name', 'text', 'primary key');
select xt.add_column('dbserver','dbserver_hostname', 'text');
select xt.add_column('dbserver','dbserver_port', 'integer');
select xt.add_column('dbserver','dbserver_descrip', 'text');
select xt.add_column('dbserver','dbserver_loc', 'text');
select xt.add_column('dbserver','dbserver_created', 'timestamp with time zone');
select xt.add_column('dbserver','dbserver_password', 'text');
select xt.add_column('dbserver','dbserver_username', 'text');

comment on table xt.dbserver is 'Database Servers';
