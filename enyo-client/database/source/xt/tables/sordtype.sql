-- table definition

select xt.create_table('sordtype', 'xt');
select xt.add_column('sordtype','sordtype_id', 'serial', 'primary key', 'xt');
select xt.add_column('sordtype','sordtype_tblname', 'text', '', 'xt');
select xt.add_column('sordtype','sordtype_code', 'text', '', 'xt');

comment on table xt.sordtype is 'Sales Order Child Type Map';



