select xt.create_table('powf', 'xt', false, 'xt.wf');

select xt.add_constraint('powf', 'powf_pkey', 'primary key (wf_id)');
select xt.add_constraint('powf', 'powf_wf_priority_id_fkey', 'foreign key (wf_priority_id) references incdtpriority (incdtpriority_id)');
select xt.add_constraint('powf', 'powf_wf_parent_uuid_fkey', 'foreign key (wf_parent_uuid) references pohead (obj_uuid) on delete cascade');

comment on table xt.powf is 'Purchase Order workflow table';
