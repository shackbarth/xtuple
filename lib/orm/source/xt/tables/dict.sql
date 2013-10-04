-- table definition

select xt.create_table('dict');
select xt.add_column('dict','dict_id', 'serial', 'primary key');
select xt.add_column('dict','dict_language_name', 'text');
select xt.add_column('dict','dict_ext_id', 'integer', 'references xt.ext (ext_id)');
select xt.add_column('dict','dict_is_database', 'boolean');
select xt.add_column('dict','dict_is_framework', 'boolean');
select xt.add_column('dict','dict_usr_username', 'text');
select xt.add_column('dict','dict_date', 'date');
select xt.add_column('dict','dict_strings', 'text');

comment on table xt.dict is 'Dictionary for linguist';
