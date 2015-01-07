-- table definition

select xt.create_table('salesemlprofile', 'xt', false, 'xt.emlprofile');
select xt.add_constraint('salesemlprofile','salesemlprofile_emlprofile_name', 'unique(emlprofile_name)');
select xt.add_constraint('salesemlprofile','salesemlprofile_pkey', 'primary key (emlprofile_id)');

comment on table xt.salesemlprofile is 'Table for sales email profiles';

-- this priv does not exist in postbooks so create it here
select xt.add_priv('MaintainSalesEmailProfiles', 'Can Maintain Sales Email Profiles', 'SaleTypes', 'Sales');
