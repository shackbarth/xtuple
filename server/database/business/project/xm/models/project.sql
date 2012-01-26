select private.create_model(

-- Model name, schema, table

'project', 'public', 'prj()',

-- Columns

E'{
  "prj.prj_id as guid",
  "prj.prj_number as number",
  "prj.prj_name as name",
  "prj.prj_descrip as notes",
  "prj.prj_start_date as start_date",
  "prj.prj_due_date as due_date",
  "prj.prj_assigned_date as assign_date",
  "prj.prj_completed_date as complete_date",
  "(select user_account_info
    from xm.user_account_info
    where username = prj.prj_username) as assigned_to",
  "prj.prj_status as project_status",
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
    select contact_assignment
    from xm.contact_assignment
    where source = prj.prj_id and source_type=\'J\') as contacts",
  "array(
    select item_assignment
    from xm.item_assignment
    where source = prj.prj_id and source_type=\'J\') as items",
  "array(
    select file_assignment
    from xm.file_assignment
    where source = prj.prj_id and source_type=\'J\') as files",
  "array(
    select image_assignment
    from xm.image_assignment
    where source = prj.prj_id and source_type=\'J\') as images",
  "array(
    select url_assignment
    from xm.url_assignment
    where source = prj.prj_id and source_type=\'J\') as urls",
  "array(
    select project_assignment
    from xm.project_assignment
    where source = prj.prj_id and source_type=\'J\') as projects"}',

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
  (new.owner).username,
  new.start_date,
  new.due_date,
  new.assign_date,
  new.complete_date,
  (new.assigned_to).username,
  new.project_status );

","

create or replace rule \\"_CREATE_CHECK_PRIV\\" as on insert to xm.project 
   where not checkPrivilege(\'MaintainAllProjects\') 
    and not (checkPrivilege(\'MaintainPersonalProjects\') 
             and ((new.owner).username = getEffectiveXtUser()
                  or (new.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to create this Project\');

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.project
  do instead

update prj set
  prj_name = new.name,
  prj_descrip = new.notes,
  prj_owner_username = (new.owner).username,
  prj_start_date = new.start_date,
  prj_due_date = new.due_date,
  prj_assigned_date = new.assign_date,
  prj_completed_date = new.complete_date,
  prj_username = (new.assigned_to).username,
  prj_status = new.project_status
where ( prj_id = old.guid );

","

create or replace rule \\"_UPDATE_CHECK_PRIV\\" as on update to xm.project
   where not checkPrivilege(\'MaintainAllProjects\') 
    and not (checkPrivilege(\'MaintainPersonalProjects\') 
             and ((old.owner).username = getEffectiveXtUser()
               or (old.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to update this Project\');

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

delete from private.docinfo
where ( source_id = old.guid ) 
 and ( source_type = \'J\' );

delete from prj
where ( prj_id = old.guid );

)

","

create or replace rule \\"_DELETE_CHECK_PRIV\\" as on delete to xm.project 
   where not checkPrivilege(\'MaintainAllProjects\') 
    and not (checkPrivilege(\'MaintainPersonalProjects\') 
             and ((old.owner).username = getEffectiveXtUser()
                  or (old.assigned_to).username = getEffectiveXtUser())) do instead

  select private.raise_exception(\'You do not have privileges to delete this Project\');

"}',

-- Conditions, Comment, System

'{}', 'Project Model', true, false, 'J');
