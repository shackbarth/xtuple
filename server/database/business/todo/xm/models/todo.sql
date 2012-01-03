select private.create_model(

-- Model name, schema, table

'todo', 'public', 'todoitem',

-- Columns

E'{
  "todoitem_id as guid",
  "todoitem_id as number",
  "todoitem_name as name",
  "todoitem_description as description",
  "btrim(array(
    select cntct_id
    from cntct
    where cntct_crmacct_id = todoitem_id)::text,\'{}\') as contacts",
  "todoitem_status as todo_status",
  "todoitem_active as is_active",
  "todoitem_start_date as start_date",
  "todoitem_due_date as due_date",
  "todoitem_assigned_date as assign_date",
  "todoitem_completed_date as complete_date",
  "todoitem_notes as notes",
  "todoitem_priority_id as priority",  
  "btrim(array(
    select alarm_id 
    from alarm
    where alarm_source_id = todoitem_id 
    and alarm_source = \'TODO\')::text,\'{}\') as alarms",  
  "btrim(array(
    select comment_id
    from comment
    where comment_source_id = todoitem_id
    and comment_source = \'TD\')::text,\'{}\') as comments",
  "btrim(array(
    select docass_id 
    from docass
    where docass_target_id = todoitem_id 
      and docass_target_type = \'TODO\'
    union all
    select docass_id 
    from docass
    where docass_source_id = todoitem_id 
      and docass_source_type = \'TODO\'
    union all
    select imageass_id 
    from imageass
    where imageass_source_id = todoitem_id 
      and imageass_source = \'TODO\')::text,\'{}\') as documents",  
  "todoitem_owner_username as owner",
  "todoitem_username as assigned_to"}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.todo 
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
  todoitem_username )
values (
  new.guid,
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

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.todo
  do instead

update todoitem set
  todoitem_id = new.guid,
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
where ( todoitem_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.todo 
  do instead (

delete from comment 
where ( comment_source_id = old.guid ) 
 and ( comment_source = \'TD\' );

delete from docass
where ( docass_target_id = old.guid ) 
 and ( docass_target_type = \'TODO\' );

delete from docass
where ( docass_source_id = old.guid ) 
 and ( docass_source_type = \'TODO\' );

delete from imageass
where ( imageass_source_id = old.guid ) 
 and ( imageass_source = \'TODO\' );

delete from todoitem
where ( todoitem_id = old.guid );

)"}',

-- Conditions, Comment, System

'{}', 'Todo Model', true);