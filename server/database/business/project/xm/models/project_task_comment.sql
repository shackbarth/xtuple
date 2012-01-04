select private.create_model(

-- Model name, schema, table

'project_task_comment', 'public', 'comment',

-- Columns

E'{
  "comment.comment_id as guid",
  "comment.comment_source_id as project_task",
  "comment.comment_date as date",
  "comment.comment_user as user",
  "comment.comment_cmnttype_id as comment_type",
  "comment.comment_text as text",
  "comment.comment_public as is_public"}',
-- sql query...  AS can_update - value derived from role(s) privileges, etc...(not implemented yet)

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.project_task_comment
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
  new.project_task,
  \'TA\',
  new.date,
  new.user,
  new.comment_type,
  new.text,
  new.is_public );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.project_task_comment
  do instead

update comment set
  comment_text = new.text
where ( comment_id  = old.guid );

","

-- delete rule
create or replace rule \\"_DELETE\\" as on delete to xm.project_task_comment
  do instead nothing;

"}',

-- Conditions, Comment, System

'{"comment.comment_source = \'TA\'"}','Project Task Comment Model', true);
