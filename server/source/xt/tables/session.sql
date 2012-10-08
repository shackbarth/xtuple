-- table definition

select xt.create_table('session');
select xt.add_column('session','session_id', 'serial', 'primary key');
select xt.add_column('session','session_sid', 'text', 'unique');
select xt.add_column('session','session_created', 'timestamp with time zone');
select xt.add_column('session','session_updated', 'timestamp with time zone');
select xt.add_column('session','session_checksum', 'text');
select xt.add_column('session','session_org_id', 'integer', 'references xt.org (org_id)');
select xt.add_column('session','session_socket', 'text');

comment on table xt.session is 'Sessions';
