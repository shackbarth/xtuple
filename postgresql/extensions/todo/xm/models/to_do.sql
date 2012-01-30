select private.create_model(

-- Model name, schema, table

'to_do', 'public', 'todoitem',

-- Columns

E'{
  "todoitem.todoitem_id as guid",
  "todoitem.todoitem_id as number",
  "todoitem.todoitem_name as name",
  "todoitem.todoitem_description as description",
  "(select contact_info
    from xm.contact_info
    where guid = todoitem.todoitem_cntct_id) as contact",
  "todoitem.todoitem_status as to_do_status",
  "todoitem.todoitem_active as is_active",
  "todoitem.todoitem_start_date as start_date",
  "todoitem.todoitem_due_date as due_date",
  "todoitem.todoitem_assigned_date as assign_date",
  "todoitem.todoitem_completed_date as complete_date",
  "todoitem.todoitem_notes as notes",
  "todoitem.todoitem_priority_id as priority",  
  "(select user_account_info
    from xm.user_account_info
    where username = todoitem.todoitem_owner_username) as owner",
  "(select user_account_info
    from xm.user_account_info
    where username = todoitem.todoitem_username) as assigned_to",
  "array(
    select to_do_alarm 
    from xm.to_do_alarm
    where to_do = todoitem.todoitem_id) as alarms",
  "array(
    select to_do_comment
    from xm.to_do_comment
    where to_do = todoitem.todoitem_id) as comments",
  "array(
    select to_do_contact
    from xm.to_do_contact
    where source = todoitem.todoitem_id) as contacts",
  "array(
    select to_do_item
    from xm.to_do_item
    where source = todoitem.todoitem_id) as items",
  "array(
    select to_do_file
    from xm.to_do_file
    where source = todoitem.todoitem_id) as files",
  "array(
    select to_do_image
    from xm.to_do_image
    where source = todoitem.todoitem_id) as images",
  "array(
    select to_do_url
    from xm.to_do_url
    where source = todoitem.todoitem_id) as urls",
  "array(
    select to_do_to_do
    from xm.to_do_to_do
    where source = todoitem.todoitem_id) as to_dos"}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.to_do 
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
  new.to_do_status,
  new.is_active,
  new.start_date,
  new.due_date,
  new.assign_date,
  new.complete_date,
  new.notes,
  new.priority,
  (new.owner).username,
  (new.assigned_to).username );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.to_do
  do instead

update todoitem set
  todoitem_id = new.guid,
  todoitem_name = new.name,
  todoitem_description = new.description,
  todoitem_status = new.to_do_status,
  todoitem_active = new.is_active,
  todoitem_start_date = new.start_date,
  todoitem_due_date = new.due_date,
  todoitem_assigned_date = new.assign_date,
  todoitem_completed_date = new.complete_date,
  todoitem_notes = new.notes,
  todoitem_priority_id = new.priority,
  todoitem_owner_username = (new.owner).username,
  todoitem_username = (new.assigned_to).username
where ( todoitem_id = old.guid );

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.to_do 
  do instead (

delete from comment 
where ( comment_source_id = old.guid ) 
 and ( comment_source = \'TD\' );

delete from private.docinfo
where ( source_id = old.guid ) 
 and ( source_type = \'TODO\' );

delete from todoitem
where ( todoitem_id = old.guid );

)"}',

-- Conditions, Comment, System

'{}', 'ToDo Model', true, false, 'TODO');