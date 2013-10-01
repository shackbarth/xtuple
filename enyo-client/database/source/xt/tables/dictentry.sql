select xt.create_table('dictentry');
select xt.add_column('dictentry','dictentry_id', 'serial', 'primary key');
select xt.add_column('dictentry','dictentry_dict_id', 'integer', 'not null references xt.dict (dict_id)');
select xt.add_column('dictentry','dictentry_ext_id', 'integer', 'references xt.ext (ext_id)');
select xt.add_column('dictentry','dictentry_key', 'text');
select xt.add_column('dictentry','dictentry_usr_username', 'text');
select xt.add_column('dictentry','dictentry_date', 'date');
select xt.add_column('dictentry','dictentry_translation', 'text');
select xt.add_column('dictentry','dictentry_is_database', 'boolean');

comment on table xt.dictentry is 'Dictionary entry for linguist';
