-- table definition

select xt.create_table('session');
select xt.add_column('session','session_id', 'text');
select xt.add_column('session','session_sid', 'text', 'primary key');
select xt.add_column('session','session_created', 'bigint');
select xt.add_column('session','session_updated', 'bigint');
select xt.add_column('session','session_checksum', 'text');
select xt.add_column('session','session_org_name', 'text', 'references xt.org (org_name)');
select xt.add_column('session','session_username', 'text');
select xt.add_column('session','session_socket', 'text');

comment on table xt.session is 'Sessions';
