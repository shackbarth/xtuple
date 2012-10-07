-- table definition

select xt.create_table('org');
select xt.add_column('org','org_id', 'serial', 'primary key');
select xt.add_column('org','org_name', 'text', 'unique');
select xt.add_column('org','org_dbserver_id', 'integer', 'not null references xt.dbserver (dbserver_id)');
select xt.add_column('org','org_descrip', 'text');

comment on table xt.org is 'Organizations which technically are databases';
