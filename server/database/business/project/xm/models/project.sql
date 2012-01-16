select private.create_model(

-- Model name, schema, table

'project', 'public', 'prj()',

-- Columns

E'{
  "prj_id as guid",
  "prj_number as number",
  "prj_name as name",
  "prj_descrip as notes",
  "prj_start_date as start_date",
  "prj_due_date as due_date",
  "prj_assigned_date as assign_date",
  "prj_completed_date as complete_date",
  "prj_username as assign_to",
  "prj_status as project_status",
  "(select user_account_info
   from xm.user_account_info
   where username = prj.prj_owner_username) as owner",
  "array(
   select project_comment
   from xm.project_comment
   where project = prj.prj_id) as comments",
  "array(
   select project_task 
   from xm.project_task
   where project = prj.prj_id) as tasks",
  "array(
    select project_document
    from xm.project_document
    where project = prj.prj_id) as documents"}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.project
  do instead

insert into prj (
  prj_id,
  prj_number,
  prj_name,
  prj_descrip,
  prj_owner_username,
  prj_start_date,
  prj_due_date,
  prj_assigned_date,
  prj_completed_date,
  prj_username,
  prj_status )
values (
  new.guid,
  new.number,
  new.name,
  new.notes,
  new.owner,
  new.start_date,
  new.due_date,
  new.assign_date,
  new.complete_date,
  new.assign_to,
  new.project_status );

","

create or replace rule \\"_CREATE_CHECK_PRIV\\" as on insert to xm.project 
   where not checkPrivilege(\'MaintainAllProjects\') 
    and not (checkPrivilege(\'MaintainPersonalProjects\') 
             and (new.owner).username = getEffectiveXtUser()) do instead

  select private.raise_exception(\'You do not have privileges to create this project\');

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.project
  do instead

update prj set
  prj_name = new.name,
  prj_descrip = new.notes,
  prj_owner_username = new.owner,
  prj_start_date = new.start_date,
  prj_due_date = new.due_date,
  prj_assigned_date = new.assign_date,
  prj_completed_date = new.complete_date,
  prj_username = new.assign_to,
  prj_status = new.project_status
where ( prj_id = old.guid );

","

create or replace rule \\"_UPDATE_CHECK_PRIV\\" as on update to xm.project
   where not checkPrivilege(\'MaintainAllProjects\') 
    and not (checkPrivilege(\'MaintainPersonalProjects\') 
             and (old.owner).username = getEffectiveXtUser()
             and (new.owner).username = getEffectiveXtUser()) do instead

  select private.raise_exception(\'You do not have privileges to update this project\');

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.project
  do instead (

delete from comment
 where ((comment_source_id in ( select prjtask_id
				 from prjtask
				 where prjtask_prj_id = old.guid)
				 or comment_source_id = old.guid)
 and comment_source in (\'J\',\'TA\'));

delete from prjtask
where ( prjtask_prj_id = old.guid );

delete from docass
where (docass_target_id = old.guid
 and docass_target_type = \'J\');

delete from docass
where (docass_source_id = old.guid
 and docass_source_type = \'J\');

delete from imageass
 where ( imageass_source_id = old.guid
and imageass_source = \'J\' );

delete from prj
where ( prj_id = old.guid );

)

","

create or replace rule \\"_DELETE_CHECK_PRIV\\" as on delete to xm.project 
   where not checkPrivilege(\'MaintainAllProjects\') 
    and not (checkPrivilege(\'MaintainPersonalProjects\') 
             and (old.owner).username = getEffectiveXtUser()) do instead

  select private.raise_exception(\'You do not have privileges to delete this Project\');

"}',

-- Conditions, Comment, System

'{}', 'Project Model', true);
