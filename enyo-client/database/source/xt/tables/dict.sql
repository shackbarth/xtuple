-- table definition

select xt.create_table('dict');
select xt.add_column('dict','dict_id', 'serial', 'primary key');
select xt.add_column('dict','dict_language_name', 'text');
select xt.add_column('dict','dict_language_version', 'integer');

comment on table xt.dict is 'Dictionary for linguist';
