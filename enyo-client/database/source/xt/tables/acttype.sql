-- table definition

select xt.create_table('acttype', 'xt');
select xt.add_column('acttype','acttype_id', 'serial', 'primary key', 'xt');
select xt.add_column('acttype','acttype_tblname', 'text');
select xt.add_column('acttype','acttype_code', 'text');

comment on table xt.acttype is 'Activity Type Map';
