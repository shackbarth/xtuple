select xt.create_table('prjwf', 'xt', false, 'xt.wf');

select xt.add_constraint('prjwf', 'prjwf_pkey', 'primary key (wf_id)');
select xt.add_constraint('prjwf', 'prjwf_wf_priority_id_fkey', 'foreign key (wf_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('prjwf', 'prjwf_wf_parent_uuid_fkey', 'foreign key (wf_parent_uuid) references prj (obj_uuid) on delete cascade');

comment on table xt.prjwf is 'Project workflow table';
