-- table definition

select xt.create_table('ext');
select xt.add_column('ext','ext_id', 'serial', 'primary key');
select xt.add_column('ext','ext_name', 'text');
select xt.add_column('ext','ext_descrip', 'text');
select xt.add_column('ext','ext_location', 'text');
select xt.add_column('ext','ext_notes', 'text');

comment on table xt.ext is 'Extensions';
