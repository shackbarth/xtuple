select dropIfExists('VIEW', 'todo', 'xm');
-- For Testing
-- select dropIfExists('VIEW', 'todo_alarm', 'xm');
-- selecst dropIfExists('VIEW', 'todo_comment', 'xm');
-- select dropIfExists('VIEW', 'todo_info', 'xm');

-- return rule

create or replace view xm.todo as 

select
	todoitem_id as id,
	todoitem_id as number,
	todoitem_name as name,
	todoitem_description as description,
    rtrim(ltrim(array(
      select cntct_id
      from cntct
      where cntct_crmacct_id = todoitem_id )::text,'{'),'}') as contacts,
	todoitem_status as todo_status,
	todoitem_active as is_active,
	todoitem_start_date as start_date,
	todoitem_due_date as due_date,
	todoitem_assigned_date as assign_date,
	todoitem_completed_date as complete_date,
	todoitem_notes as notes,
	todoitem_priority_id as priority,	
	rtrim(ltrim(array(
	  select alarm_id 
	  from alarm
	  where alarm_source_id = todoitem_id 
	    and alarm_source = 'TODO')::text,'{'),'}') as alarms,
	rtrim(ltrim(array(
	  select comment_id 
	  from comment
	  where comment_source_id = todoitem_id 
	    and comment_source = 'TD')::text,'{'),'}') as comments,
	rtrim(ltrim(array(
	  select docass_id 
	  from docass
	  where docass_target_id = todoitem_id 
	    and docass_target_type = 'TODO'
	  union all
	  select docass_id 
	  from docass
	  where docass_source_id = todoitem_id 
	    and docass_source_type = 'TODO'
	  union all
	  select imageass_id 
	  from imageass
	  where imageass_source_id = todoitem_id 
	    and imageass_source = 'TODO')::text,'{'),'}') as documents,
	todoitem_owner_username as owner,
	todoitem_username as assigned_to
from todoitem;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.todo 
  do instead

insert into todoitem (
	todoitem_id, 
	todoitem_name, 
	todoitem_description, 
	todoitem_status, 
	todoitem_active, 
	todoitem_start_date, 
	todoitem_due_date, 
	todoitem_assigned_date, 
	todoitem_completed_date, 
	todoitem_notes, 
	todoitem_priority_id, 
	todoitem_owner_username, 
	todoitem_username                      
 )
values (
	new.id,
	new.name,
	new.description,
	new.todo_status,
	new.is_active,
	new.start_date,
	new.due_date,
	new.assign_date,
	new.complete_date,
	new.notes,
	new.priority,
	new.owner,
	new.assigned_to );

-- update rule

create or replace rule "_UPDATE" as on update to xm.todo
  do instead

update todoitem set
	todoitem_id = new.id,
	todoitem_name = new.name,
	todoitem_description = new.description,
	todoitem_status = new.todo_status,
	todoitem_active = new.is_active,
	todoitem_start_date = new.start_date,
	todoitem_due_date = new.due_date,
	todoitem_assigned_date = new.assign_date,
	todoitem_completed_date = new.complete_date,
	todoitem_notes = new.notes,
	todoitem_priority_id = new.priority,
	todoitem_owner_username = new.owner,
	todoitem_username = new.assigned_to
where ( todoitem_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.todo 
  do instead (

delete from comment 
where ( comment_source_id = old.id ) 
 and ( comment_source = 'TD' );

delete from docass
where ( docass_target_id = old.id ) 
 and ( docass_target_type = 'TODO' );

delete from docass
where ( docass_source_id = old.id ) 
 and ( docass_source_type = 'TODO' );

delete from imageass
where ( imageass_source_id = old.id ) 
 and ( imageass_source = 'TODO' );

delete from todoitem
where ( todoitem_id = old.id );

)

