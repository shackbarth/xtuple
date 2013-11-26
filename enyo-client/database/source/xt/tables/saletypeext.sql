select xt.create_table('saletypeext');

select xt.add_column('saletypeext','saletypeext_id', 'integer', 'primary key');
select xt.add_column('saletypeext','saletypeext_emlprofile_id', 'integer');
select xt.add_column('saletypeext','saletypeext_default_hold_type', 'text');

comment on table xt.saletypeext is 'Sale type extension table';
