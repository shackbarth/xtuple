-- table definition

select xt.create_table('prjemlprofile', 'xt', false, 'xt.emlprofile');
select xt.add_constraint('prjemlprofile','prjemlprofile_emlprofile_name', 'unique(emlprofile_name)');
select xt.add_constraint('prjemlprofile','prjemlprofile_pkey', 'primary key (emlprofile_id)');

comment on table xt.prjemlprofile is 'Table for project email profiles';

-- this priv does not exist in postbooks so create it here
select xt.add_priv('MaintainProjectEmailProfiles', 'Can Maintain Project Email Profiles', 'Projects', 'Project');
