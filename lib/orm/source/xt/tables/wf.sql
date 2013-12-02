select xt.create_table('wf', 'xt', false, 'xt.obj');


select xt.add_column('wf','wf_id', 'serial', 'primary key');
select xt.add_column('wf','wf_name', 'text');
select xt.add_column('wf','wf_description', 'text');
select xt.add_column('wf','wf_type', 'text');
select xt.add_column('wf','wf_status', 'text', 'not null');
select xt.add_column('wf','wf_start_date', 'date');
select xt.add_column('wf','wf_due_date', 'date');
select xt.add_column('wf','wf_assigned_date', 'date');
select xt.add_column('wf','wf_completed_date', 'date');
select xt.add_column('wf','wf_notes', 'text');
select xt.add_column('wf','wf_priority_id', 'integer', 'not null');
select xt.add_column('wf','wf_owner_username', 'text');
select xt.add_column('wf','wf_assigned_username', 'text');
select xt.add_column('wf','wf_parent_uuid', 'uuid');
select xt.add_column('wf','wf_completed_parent_status', 'text');
select xt.add_column('wf','wf_deferred_parent_status', 'text');
select xt.add_column('wf','wf_sequence', 'integer', 'not null default 0');
select xt.add_column('wf','wf_completed_successors', 'text');
select xt.add_column('wf','wf_deferred_successors', 'text');

comment on table xt.wf is 'Workflow extension table';

DO $$
  /* Migrate from previous implementation (for 1.5.1) */  
  try {
    plv8.execute("update xt.wf set wf_parent_uuid = prj.obj_uuid from prj " +
      "where wf_parent_id = prj_id and wf_parent_uuid is null;");
    plv8.execute("alter table xt.wf drop column if exists wf_parent_id cascade");
  } catch (error) {
  }
$$ language plv8;
