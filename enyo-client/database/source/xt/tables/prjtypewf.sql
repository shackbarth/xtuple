select xt.create_table('prjtypewf', 'xt', false, 'xt.wfsrc');

select xt.add_constraint('prjtypewf', 'prjtypewf_pkey', 'primary key (wfsrc_id)');
select xt.add_constraint('prjtypewf', 'prjtypewf_wfsrc_priority_id_fkey', 'foreign key (wfsrc_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('prjtypewf', 'prjtypewf_wfsrc_parent_id_fkey', 'foreign key (wfsrc_parent_id) references prjtype (prjtype_id) on delete cascade');

comment on table xt.prjtypewf is 'Project type workflow table';