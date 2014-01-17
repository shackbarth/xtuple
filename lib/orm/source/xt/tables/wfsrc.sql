select xt.create_table('wfsrc', 'xt', false, 'xt.obj');

select xt.add_column('wfsrc','wfsrc_id', 'serial', 'primary key');
select xt.add_column('wfsrc','wfsrc_name', 'text');
select xt.add_column('wfsrc','wfsrc_description', 'text');
select xt.add_column('wfsrc','wfsrc_type', 'text');
select xt.add_column('wfsrc','wfsrc_start_set', 'boolean', 'default false');
select xt.add_column('wfsrc','wfsrc_start_offset', 'integer', 'default 0');
select xt.add_column('wfsrc','wfsrc_due_set', 'boolean', 'default false');
select xt.add_column('wfsrc','wfsrc_due_offset', 'integer', 'default 0');
select xt.add_column('wfsrc','wfsrc_notes', 'text');
select xt.add_column('wfsrc','wfsrc_priority_id', 'integer', 'not null');
select xt.add_column('wfsrc','wfsrc_owner_username', 'text');
select xt.add_column('wfsrc','wfsrc_assigned_username', 'text');
select xt.add_column('wfsrc','wfsrc_parent_id', 'integer');
select xt.add_column('wfsrc','wfsrc_completed_parent_status', 'text');
select xt.add_column('wfsrc','wfsrc_deferred_parent_status', 'text');
select xt.add_column('wfsrc','wfsrc_sequence', 'integer', 'not null default 0');
select xt.add_column('wfsrc','wfsrc_completed_successors', 'text');
select xt.add_column('wfsrc','wfsrc_deferred_successors', 'text');
select xt.add_column('wfsrc','wfsrc_status', 'text', 'default ''P''');

comment on table xt.wfsrc is 'Workflow source table';
