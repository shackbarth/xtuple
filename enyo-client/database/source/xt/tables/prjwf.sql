select xt.create_table('prjwf', 'xt', false, 'todoitem, xt.wf');

select xt.add_constraint('prjwf', 'prjwf_pkey', 'primary key (todoitem_id)');
select xt.add_constraint('prjwf', 'prjwf_wf_parent_id_fkey', 'foreign key (wf_parent_id) references prj (prj_id) on delete cascade');

comment on table xt.prjwf is 'Project workflow table';