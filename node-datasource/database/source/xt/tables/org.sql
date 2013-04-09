-- table definition

select xt.create_table('org');
select xt.add_column('org','org_name', 'text', 'primary key');
select xt.add_column('org','org_dbserver_name', 'text', 'not null references xt.dbserver (dbserver_name)');
select xt.add_column('org','org_descrip', 'text');
select xt.add_column('org','org_cloud', 'text');
select xt.add_column('org','org_licenses', 'integer');
select xt.add_column('org','org_active', 'boolean');
select xt.add_column('org','org_group', 'text');

select xt.add_column('org','org_dbcreated', 'timestamp with time zone');
select xt.add_column('org','org_dbexpire', 'timestamp with time zone');
select xt.add_column('org','org_cmpg_id', 'integer', 'references xt.cmpg (cmpg_id)');
select xt.add_column('org','org_src', 'text');
select xt.add_column('org','org_ip', 'text');
select xt.add_column('org','org_free_trial', 'boolean');

comment on table xt.org is 'Organizations which technically are databases';
