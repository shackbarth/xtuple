-- table definition

select xt.create_table('datasource');
select xt.add_column('datasource','datasource_id', 'serial', 'primary key');
select xt.add_column('datasource','datasource_name', 'text', 'unique');
select xt.add_column('datasource','datasource_hostname', 'text');
select xt.add_column('datasource','datasource_port', 'text');
select xt.add_column('datasource','datasource_descrip', 'text');
select xt.add_column('datasource','datasource_loc', 'text');
select xt.add_column('datasource','datasource_created', 'timestamp with time zone');

comment on table xt.datasource is 'Datasources';
