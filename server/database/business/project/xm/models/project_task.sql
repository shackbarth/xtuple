select private.create_model(

-- Model name, schema, table

'project_task', 'public', 'prjtask',

-- Columns

-- xm.priority not currently implemented in the prjtask table...
-- xm.isActive not currently implemented in the prjtask table...
-- Project calculations
-- coalesce(prjtask.prjtask_hours_budget, 0.0) as budgeted_hours,
-- coalesce(prjtask.prjtask_hours_actual, 0.0) as actual_hours,
-- coalesce((prjtask.prjtask_hours_budget - prjtask.prjtask_hours_actual), 0.0) as balance_hours,
-- coalesce(prjtask.prjtask_exp_budget, 0.00) as budgeted_expenses,
-- coalesce(prjtask.prjtask_exp_actual, 0.00) as actual_expenses,
-- coalesce((prjtask.prjtask_exp_budget - prjtask.prjtask_exp_actual), 0.00) as balance_expenses,
E'{
  "prjtask.prjtask_id as guid",
  "prjtask.prjtask_number as number",
  "prjtask.prjtask_name as name",
  "prjtask.prjtask_descrip as notes",
  "prjtask.prjtask_prj_id as project",
  "prjtask.prjtask_status as project_task_status",
  "prjtask.prjtask_hours_budget as budgeted_hours",
  "prjtask.prjtask_hours_actual as actual_hours",
  "null::numeric as balance_hours",
  "prjtask.prjtask_exp_budget as budgeted_expenses",
  "prjtask.prjtask_exp_actual as actual_expenses",
  "null::numeric as balance_expenses",
  "prjtask.prjtask_owner_username as owner",
  "prjtask.prjtask_start_date as start_date",
  "prjtask.prjtask_due_date as due_date",
  "prjtask.prjtask_assigned_date as assign_date",
  "prjtask.prjtask_completed_date as complete_date",
  "prjtask.prjtask_username as assigned_to",
  "null::integer as priority",
  "null::boolean as is_active",
  "btrim(array(
  select comment_id
    from comment
    where comment_source_id = prjtask.prjtask_id
    and comment_source = \'TA\')::text,\'{}\') as comments",
  "btrim(array(
    select alarm_id
    from alarm
    where alarm_source_id = prjtask.prjtask_id
    and alarm_source = \'J\')::text,\'{}\') as alarms"}',

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.project_task
  do instead

insert into prjtask (
  prjtask_id,
  prjtask_number,
  prjtask_name,
  prjtask_descrip,
  prjtask_prj_id,
  prjtask_status,
  prjtask_hours_budget,
  prjtask_hours_actual,
  prjtask_exp_budget,
  prjtask_exp_actual,
  prjtask_owner_username,
  prjtask_start_date,
  prjtask_due_date,
  prjtask_assigned_date,
  prjtask_completed_date,
  prjtask_username )
values (
  new.guid,
  new.number,
  new.name,
  new.notes,
  new.project,
  new.project_task_status,
  coalesce(new.budgeted_hours, 0.0),
  coalesce(new.actual_hours, 0.0),
  coalesce(new.budgeted_expenses, 0.00),
  coalesce(new.actual_expenses, 0.00),
  new.owner,
  new.start_date,
  new.due_date,
  new.assign_date,
  new.complete_date,
  new.assigned_to );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.project_task
  do instead

update prjtask set
  prjtask_name = new.name,
  prjtask_descrip = new.notes,
  prjtask_status = new.project_task_status,
  prjtask_hours_budget = coalesce(new.budgeted_hours, 0.0),
  prjtask_hours_actual = coalesce(new.actual_hours, 0.0),
  prjtask_exp_budget = coalesce(new.budgeted_expenses, 0.00),
  prjtask_exp_actual = coalesce(new.actual_expenses, 0.00),
  prjtask_owner_username = new.owner,
  prjtask_start_date = new.start_date,
  prjtask_due_date = new.due_date,
  prjtask_assigned_date = new.assign_date,
  prjtask_completed_date = new.complete_date,
  prjtask_username = new.assigned_to
where ( prjtask_id = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.project_task
  do instead (

delete from comment
where (comment_source_id = old.guid
and comment_source = \'TA\');

delete from alarm
where (alarm_source_id = old.guid
and alarm_source = \'J\');

delete from prjtask
where (prjtask_id = old.guid);

)"}',

-- Conditions, Comment, System

'{}', 'Project Task Model', true);