-- table definition

select xt.create_table('custemlprofile', 'xt', false, 'xt.emlprofile');
select xt.add_constraint('custemlprofile','custemlprofile_emlprofile_name', 'unique(emlprofile_name)');
select xt.add_constraint('custemlprofile','custemlprofile_pkey', 'primary key (emlprofile_id)');

comment on table xt.custemlprofile is 'Table for customer email profiles';

-- this priv does not exist in postbooks so create it here
select xt.add_priv('MaintainCustomerEmailProfiles', 'Can Maintain Customer Email Profiles', 'Customer', 'Customer');
