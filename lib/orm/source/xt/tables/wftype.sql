-- table definition

select xt.create_table('wftype', 'xt');
select xt.add_column('wftype','wftype_id', 'serial', 'primary key', 'xt');
select xt.add_column('wftype','wftype_tblname', 'text', '', 'xt');
select xt.add_column('wftype','wftype_code', 'text', '', 'xt');
select xt.add_column('wftype','wftype_src_tblname', 'text', '', 'xt');

comment on table xt.wftype is 'Workflow Type Map';
