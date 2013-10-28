select xt.create_table('wf', 'xt', false, 'xt.obj');

select xt.add_column('wf','wf_id', 'serial', 'primary key');
select xt.add_column('wf','wf_name', 'text');
select xt.add_column('wf','wf_description', 'text');
select xt.add_column('wf','wf_status', 'text', 'not null');
select xt.add_column('wf','wf_start_date', 'date');
select xt.add_column('wf','wf_due_date', 'date');
select xt.add_column('wf','wf_assigned_date', 'date');
select xt.add_column('wf','wf_completed_date', 'date');
select xt.add_column('wf','wf_notes', 'text');
select xt.add_column('wf','wf_priority_id', 'integer', 'not null');
select xt.add_column('wf','wf_owner_username', 'text');
select xt.add_column('wf','wf_assigned_username', 'text');
select xt.add_column('wf','wf_parent_id', 'integer');
select xt.add_column('wf','wf_parent_status', 'text');

comment on table xt.wf is 'Workflow extension table';