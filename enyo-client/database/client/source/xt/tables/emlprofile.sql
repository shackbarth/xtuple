-- table definition

select xt.create_table('emlprofile');
select xt.add_column('emlprofile','emlprofile_id', 'serial', 'primary key');
select xt.add_column('emlprofile','emlprofile_name', 'text', 'not null');
select xt.add_column('emlprofile','emlprofile_descrip', 'text');
select xt.add_column('emlprofile','emlprofile_from', 'text');
select xt.add_column('emlprofile','emlprofile_replyto', 'text');
select xt.add_column('emlprofile','emlprofile_to', 'text');
select xt.add_column('emlprofile','emlprofile_cc', 'text');
select xt.add_column('emlprofile','emlprofile_bcc', 'text');
select xt.add_column('emlprofile','emlprofile_subject', 'text');
select xt.add_column('emlprofile','emlprofile_body', 'text');

comment on table xt.emlprofile is 'Core table for email profiles';
