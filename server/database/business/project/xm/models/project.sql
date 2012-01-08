select private.create_model(

-- Model name, schema

'project', '',

-- Table

E'(select 
  prj_id as guid,
  prj_number as number,
  prj_name as name,
  prj_descrip as notes,
  prj_owner_username as owner,
  prj_start_date as start_date,
  prj_due_date as due_date,
  prj_assigned_date as assign_date,
  prj_completed_date as complete_date,
  prj_username as assign_to,
  null::integer as priority, -- priority is part of the inherited xt.activity model, but there is no priority field in the prj table...
  prj_status as project_status,
  btrim(array(
    select comment_id
    from comment
    where comment_source_id = prj_id
     and comment_source = \'J\')::text,\'{}\') as comments,
  btrim(array(
    select prjtask_id
    from prjtask
    where prjtask_prj_id = prj_id)::text,\'{}\') as tasks,
  btrim(array(
    select docass_id 
    from docass
    where docass_target_id = prj_id 
     and docass_target_type = \'J\'
    union all
    select docass_id 
    from docass
    where docass_source_id = prj_id 
     and docass_source_type = \'J\'
    union all
    select imageass_id 
    from imageass
    where imageass_source_id = prj_id 
    and imageass_source = \'J\')::text,\'{}\') as documents
from public.prj) prj',

-- Columns

E'{
  "prj.guid",
  "prj.number",
  "prj.name",
  "prj.notes",
  "prj.owner",
  "prj.start_date",
  "prj.due_date",
  "prj.assign_date",
  "prj.complete_date",
  "prj.assign_to",
  "prj.priority",
  "prj.project_status",
  "prj.comments",
  "prj.tasks",
  "prj.documents"}',

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

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.project
  do instead (

delete from comment
 where ((comment_source_id in (  select  prjtask_id
        from prjtask
        where prjtask_prj_id = old.guid)
or comment_source_id = old.guid)
and comment_source in (\'J\',\'TA\'));

delete from prjtask
where ( prjtask_prj_id = old.guid );

delete from docass
where (docass_target_id = old.guid  
and docass_target_type = \'J\')
 or
(docass_source_id = old.guid
and docass_source_type = \'J\');

delete from imageass
 where ( imageass_source_id = old.guid
and imageass_source = \'J\' );

delete from prj
where ( prj_id = old.guid );

)"}',

-- Conditions, Comment, System

'{}', 'Project Model', true);