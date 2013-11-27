select xt.create_table('coheadwf', 'xt', false, 'xt.wf');

select xt.add_constraint('coheadwf', 'coheadwf_pkey', 'primary key (wf_id)');
select xt.add_constraint('coheadwf', 'coheadwf_wf_priority_id_fkey', 'foreign key (wf_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('coheadwf', 'coheadwf_wf_parent_uuid_fkey', 'foreign key (wf_parent_uuid) references cohead (obj_uuid) on delete cascade');

comment on table xt.coheadwf is 'Sales order workflow table';
