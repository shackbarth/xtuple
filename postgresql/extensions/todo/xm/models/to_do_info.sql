select private.create_model(

-- Model name, schema, table

'to_do_info', 'public', 'todoitem',

-- Columns

E'{
  "todoitem.todoitem_id as guid",
  "todoitem.todoitem_id as number",
  "todoitem.todoitem_name as name",
  "todoitem.todoitem_active as is_active"}',

-- sequence

'',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.to_do_info
  do instead nothing;

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.to_do_info
  do instead nothing;

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.to_do_info   
  do instead nothing;

"}',

-- Conditions, Comment, System, Nested
'{}', 'Todo Info Model', true, true);