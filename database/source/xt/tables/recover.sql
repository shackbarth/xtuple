select xt.create_table('recover');

select xt.add_column('recover','recover_id', 'serial', 'primary key');
select xt.add_column('recover','recover_username', 'text');
select xt.add_column('recover','recover_hashed_token', 'text');
select xt.add_column('recover','recover_created_timestamp', 'timestamp');
select xt.add_column('recover','recover_accessed', 'boolean');
select xt.add_column('recover','recover_accessed_timestamp', 'timestamp');
select xt.add_column('recover','recover_reset', 'boolean');
select xt.add_column('recover','recover_reset_timestamp', 'timestamp');
select xt.add_column('recover','recover_expires_timestamp', 'timestamp');
select xt.add_column('recover','recover_ip', 'text');

comment on table xt.recover is 'Table for recoving forgotten passwords';

