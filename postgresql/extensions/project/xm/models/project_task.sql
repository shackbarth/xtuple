select private.create_model(

-- Model name, schema, table

'project_task', 'public', 'prjtask',

-- Columns

E'{
  "prjtask.prjtask_id as guid",
  "prjtask.prjtask_number as number",
  "prjtask.prjtask_name as name",
  "prjtask.prjtask_descrip as notes",
  "prjtask.prjtask_prj_id as project",
  "prjtask.prjtask_status as project_task_status",
  "prjtask.prjtask_hours_budget as budgeted_hours",
  "prjtask.prjtask_hours_actual as actual_hours",
  "prjtask.prjtask_exp_budget as budgeted_expenses",
  "prjtask.prjtask_exp_actual as actual_expenses",
  "prjtask.prjtask_start_date as start_date",
  "prjtask.prjtask_due_date as due_date",
  "prjtask.prjtask_assigned_date as assign_date",
  "prjtask.prjtask_completed_date as complete_date",
  "(select user_account_info
    from xm.user_account_info
    where username = prjtask.prjtask_username) as assigned_to",
  "(select user_account_info
    from xm.user_account_info
    where username = prjtask.prjtask_owner_username) as owner",
  "array(
    select project_task_comment
    from xm.project_task_comment
    where project_task = prjtask.prjtask_id) as comments",
  "array(
    select project_task_alarm 
    from xm.project_task_alarm
    where project_task = prjtask.prjtask_id) as alarms"}',

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
  (new.owner).username,
  new.start_date,
  new.due_date,
  new.assign_date,
  new.complete_date,
  (new.assigned_to).username );

","

create or replace rule \\"_CREATE_CHECK_PRIV\\" as on insert to xm.project_task
   where not checkPrivilege(\'MaintainAllProjects\') 
    and not (checkPrivilege(\'MaintainPersonalProjects\') 
             and ((new.owner).username = getEffectiveXtUser()
                  or (new.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to create this Project Task\');

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

create or replace rule \\"_UPDATE_CHECK_PRIV\\" as on update to xm.project_task
   where not checkPrivilege(\'MaintainAllProjects\') 
    and not (checkPrivilege(\'MaintainPersonalProjects\') 
             and ((old.owner).username = getEffectiveXtUser()
              or (old.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to update this Project Task\');

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

)

","

create or replace rule \\"_DELETE_CHECK_PRIV\\" as on delete to xm.project_task
   where not checkPrivilege(\'MaintainAllProjects\') 
    and not (checkPrivilege(\'MaintainPersonalProjects\') 
             and ((old.owner).username = getEffectiveXtUser()
                  or (old.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to delete this Project Task\');

"}',

-- Conditions, Order, Comment, System

'{}', '{prjtask.prjtask_number}', 'Project Task Model', true, true);
