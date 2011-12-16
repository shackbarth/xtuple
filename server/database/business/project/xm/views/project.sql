select dropIfExists('VIEW', 'project', 'xm');
select dropIfExists('VIEW', 'project_info', 'xm');

-- return rule

create or replace view xm.project as

select   
  prj_id as id,
  prj_number as "number",
  prj_name as "name",
  prj_descrip as notes,
  prj_owner_username as "owner",
  prj_start_date as start_date,
  prj_due_date as due_date,
  prj_assigned_date as assign_date,
  prj_completed_date as complete_date,
  prj_username as assign_to,
  NULL as priority, -- priority is part of the inherited xt.activity model, but there is no priority field in the prj table...
  case prj_status
   when 'P' then 'planning'
   when 'O' then 'open'
   when 'C' then 'complete'
   else 'undefined'
  end as project_status,
  coalesce(sum(prjtask_hours_budget), 0.0) as budgeted_hours,
  coalesce(sum(prjtask_hours_actual),0.0) as acutal_hours,
  coalesce(sum(prjtask_hours_budget - prjtask_hours_actual), 0.0)  as balance_hours,
  coalesce(sum(prjtask_exp_budget), 0.0) as budgeted_expenses,
  coalesce(sum(prjtask_exp_actual),0.0) as acutal_expenses,
  coalesce(sum(prjtask_exp_budget - prjtask_exp_actual), 0.0) as balance_expenses,
  BTRIM(ARRAY(
  select comment_id
  from "comment"
  where comment_source_id = prj_id
    and comment_source = 'J')::text,'{}') as "comments",
  BTRIM(ARRAY(
  select prjtask_id
  from prjtask
  where prjtask_prj_id = prj_id)::text,'{}') as tasks,
  BTRIM(ARRAY(
  select docass_id 
  from docass
  where docass_target_id = prj_id 
  and docass_target_type = 'J'
  union all
  select docass_id 
  from docass
  where docass_source_id = prj_id 
  and docass_source_type = 'J'
  union all
  select imageass_id 
  from imageass
  where imageass_source_id = prj_id 
  and imageass_source = 'J')::text,'{}') as documents
from prj
   left outer join prjtask on (prj_id = prjtask_prj_id)
   group by 
  id,
  "number",
  "name",
  notes,
  "owner",
  start_date,
  due_date,
  assign_date,
  complete_date,
  assign_to,
  priority,
  project_status,
  "comments",
  tasks,
  documents;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.project
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
  new.id,
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

-- update rule

create or replace rule "_UPDATE" as on update to xm.project
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
  prj_status = case new.project_status
       when 'planning' then 'P'
      when 'open'   then 'O'
      when 'complete' then 'C'
      else '?'
      end
where ( prj_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.project
  do instead (

delete from "comment"
 where ((comment_source_id in (  select  prjtask_id
        from prjtask
        where prjtask_prj_id = old.id)
or comment_source_id = old.id)
and comment_source in ('J','TA'));

delete from prjtask
where ( prjtask_prj_id = old.id );

delete from docass
where (docass_target_id = old.id  
and docass_target_type = 'J')
 or
(docass_source_id = old.id
and docass_source_type = 'J');

delete from imageass
 where ( imageass_source_id = old.id
and imageass_source = 'J' );

delete from prj
where ( prj_id = old.id );

)