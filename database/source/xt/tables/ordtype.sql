-- table definition

select xt.create_table('ordtype', 'xt');
select xt.add_column('ordtype','ordtype_id', 'serial', 'primary key', 'xt');
select xt.add_column('ordtype','ordtype_tblname', 'text', '', 'xt');
select xt.add_column('ordtype','ordtype_code', 'text', '', 'xt');

comment on table xt.ordtype is 'Order Type Map';

insert into xt.ordtype (ordtype_tblname, ordtype_code) 
select 'coitem', 'SO'
where not exists (select * from xt.ordtype where ordtype_tblname = 'coitem');

insert into xt.ordtype (ordtype_tblname, ordtype_code) 
select 'cohead', 'SO'
where not exists (select * from xt.ordtype where ordtype_tblname = 'cohead');
