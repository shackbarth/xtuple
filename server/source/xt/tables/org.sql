-- table definition

select xt.create_table('org');
select xt.add_column('org','org_name', 'text', 'primary key');
select xt.add_column('org','org_dbserver_name', 'text', 'not null references xt.dbserver (dbserver_name)');
select xt.add_column('org','org_descrip', 'text');
select xt.add_column('org','org_cloud', 'text');
select xt.add_column('org','org_licenses', 'integer');
select xt.add_column('org','org_active', 'boolean');

comment on table xt.org is 'Organizations which technically are databases';
