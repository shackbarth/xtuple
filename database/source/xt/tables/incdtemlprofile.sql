-- table definition

select xt.create_table('incdtemlprofile', 'xt', false, 'xt.emlprofile');
select xt.add_constraint('incdtemlprofile','incdtemlprofile_emlprofile_name', 'unique(emlprofile_name)');
select xt.add_constraint('incdtemlprofile','incdtemlprofile_pkey', 'primary key (emlprofile_id)');

comment on table xt.incdtemlprofile is 'Core table for incident email profiles';

-- this priv does not exist in postbooks so create it here
select xt.add_priv('MaintainEmailProfiles', 'Can Maintain Incident Email Profiles', 'Incidents', 'Incident');
