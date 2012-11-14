-- table definition

select xt.create_table('session');
select xt.add_column('session','session_id', 'text');
select xt.add_column('session','session_sid', 'text', 'unique');
select xt.add_column('session','session_created', 'timestamp with time zone');
select xt.add_column('session','session_updated', 'timestamp with time zone');
select xt.add_column('session','session_checksum', 'text');
select xt.add_column('session','session_org_name', 'text', 'references xt.org (org_name)');
select xt.add_column('session','session_socket', 'text');

comment on table xt.session is 'Sessions';
