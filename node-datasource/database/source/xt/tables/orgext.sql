-- table definition

select xt.create_table('orgext');
select xt.add_column('orgext','orgext_id', 'serial', 'primary key');
select xt.add_column('orgext','orgext_org_id', 'integer', 'not null references xt.org (org_id)');
select xt.add_column('orgext','orgext_ext_id', 'integer', 'not null references xt.ext (ext_id)');

comment on table xt.orgext is 'Organization extension assignments';
