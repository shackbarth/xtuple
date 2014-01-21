-- table definition

select xt.create_table('custcustemlprofile');
select xt.add_column('custcustemlprofile','custcustemlprofile_cust_id', 'integer', 'primary key');
select xt.add_column('custcustemlprofile','custcustemlprofile_custemlprofile_id', 'integer', 'references xt.custemlprofile (emlprofile_id)');

comment on table xt.custcustemlprofile is 'Core table links customers to customer email profiles';
