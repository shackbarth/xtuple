select xt.create_table('potype');

select xt.add_column('potype','potype_id', 'integer', 'primary key');
select xt.add_column('potype','potype_code', 'text');
select xt.add_column('potype','potype_descr', 'text');
select xt.add_column('potype','potype_active', 'boolean');
select xt.add_column('potype','potype_emlprofile_id', 'integer');

comment on table xt.potype is 'Purchase Order type extension table';
