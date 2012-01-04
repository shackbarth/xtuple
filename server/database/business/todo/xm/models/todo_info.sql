select private.create_model(

-- Model name, schema, table

'todo_info', 'public', 'todoitem',

-- Columns

E'{
  "todoitem.todoitem_id as guid",
  "todoitem.todoitem_id as number",
  "todoitem.todoitem_name as name",
  "todoitem.todoitem_active as is_active"}',

-- Rules

E'{"

-- insert rule

create or replace rule "_CREATE" as on insert to xm.todo_info
  do instead nothing;

","

-- update rule

create or replace rule "_UPDATE" as on update to xm.todo_info
  do instead nothing;

","
  
-- delete rules

create or replace rule "_DELETE" as on delete to xm.todo_info   
  do instead nothing;

"}',

-- Conditions, Comment, System
'{}', 'Todo Info Model', true);