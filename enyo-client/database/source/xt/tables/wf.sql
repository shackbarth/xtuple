select xt.create_table('wf');

select xt.add_column('wf','wf_parent_id', 'integer');
select xt.add_column('wf','wf_parent_status', 'text');

comment on table xt.wf is 'Workflow extension table';