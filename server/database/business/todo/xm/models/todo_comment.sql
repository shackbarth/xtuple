select privte.create_model(

-- Model name, schema, table

'todo_comment','public','comment',

-- Columns 
E'{
  "comment.comment_id as guid",
  "comment.comment_source_id as todo",
  "comment.comment_date as date",
  "comment.comment_user as username",
  "comment.comment_cmnttype_id as comment_type",
  "comment.comment_text as text",
  "comment.comment_public as is_public"}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.todo_comment 
  do instead

insert into comment (
  comment_id,
  comment_source_id,
  comment_source,
  comment_date,
  comment_user,
  comment_cmnttype_id,
  comment_text,
  comment_public )
values (
  new.guid,
  new.todo,
  \'TD\',
  new.date,
  new.username,
  new.comment_type,
  new.text,
  new.is_public );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.todo_comment
  do instead
  
update comment set
  comment_text = new.text
where ( comment_id = old.guid );

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.todo_comment   
  do instead nothing;

"}',

-- Conditions, Comment, System

'{"comment.comment_source = \'TD\'"}','Todo Comment Model', true);
