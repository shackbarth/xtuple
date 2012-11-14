-- table definition

select xt.create_table('priv');
select xt.add_column('priv','priv_id', 'integer', 'primary key');
select xt.add_column('priv','priv_name', 'text', 'unique');
select xt.add_column('priv','priv_descrip', 'text');
select xt.add_column('priv','priv_label', 'text');
select xt.add_column('priv','priv_group', 'text');
select xt.add_column('priv','priv_context', 'text');
select xt.add_constraint('priv','priv_name_idx', 'unique(priv_name)');

comment on table xt.priv is 'Core table for privileges';
