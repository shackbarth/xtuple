-- this priv does not exist in postbooks so create it here
select xt.add_priv('MaintainAllWorkflows', 'Can Maintains All Workflows', 'Workflow', 'Workflow');
select xt.add_priv('MaintainWorkflowsSelf', 'Can Maintain Personal Workflows', 'Workflow', 'Workflow');

drop view if exists xt.act cascade;

-- placeholder view

create view xt.act as
select
  null::uuid as act_uuid,
  null::text as act_editor_key,
  null::text as act_type,
  null::text as act_name,
  null::boolean as act_active,
  null::text as act_status,
  null::integer as act_priority_id,
  null::text as act_description,
  null::text as act_owner_username,
  null::text as act_assigned_username,
  null::date as act_start_date,
  null::date as act_due_date,
  null::date as act_assigned_date,
  null::date as act_completed_date,
  null::uuid as act_parent_uuid,
  null::text as act_action;

select dropIfExists('TRIGGER', 'acttype_did_change', 'xt');

-- table definition

select xt.create_table('acttype', 'xt');
select xt.add_column('acttype','acttype_id', 'serial', 'primary key', 'xt');
select xt.add_column('acttype','acttype_nsname', 'text');
select xt.add_column('acttype','acttype_tblname', 'text');
select xt.add_column('acttype','acttype_code', 'text');
select xt.add_column('acttype','acttype_col_uuid', 'text');
select xt.add_column('acttype','acttype_col_editor_key', 'text');
select xt.add_column('acttype','acttype_col_type', 'text');
select xt.add_column('acttype','acttype_col_name', 'text');
select xt.add_column('acttype','acttype_col_active', 'text');
select xt.add_column('acttype','acttype_col_status', 'text');
select xt.add_column('acttype','acttype_col_priority_id', 'text');
select xt.add_column('acttype','acttype_col_description', 'text');
select xt.add_column('acttype','acttype_col_owner_username', 'text');
select xt.add_column('acttype','acttype_col_assigned_username', 'text');
select xt.add_column('acttype','acttype_col_start_date', 'text');
select xt.add_column('acttype','acttype_col_due_date', 'text');
select xt.add_column('acttype','acttype_col_assigned_date', 'text');
select xt.add_column('acttype','acttype_col_completed_date', 'text');
select xt.add_column('acttype','acttype_col_parent_uuid', 'text');
select xt.add_column('acttype','acttype_col_action', 'text');
select xt.add_column('acttype','acttype_join', 'text');

comment on table xt.acttype is 'Activity Type Map';

-- create trigger

create trigger acttype_did_change after insert or update or delete on xt.acttype for each row execute procedure xt.acttype_did_change();

delete from xt.acttype;
