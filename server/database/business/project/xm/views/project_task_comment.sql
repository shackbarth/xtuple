select dropIfExists('VIEW', 'project_task_comment', 'xm');

-- return rule
create or replace view xm.project_task_comment as

select 
  comment_id as id,
  comment_source_id as project_task,
  comment_date as "date",
  comment_user as "user",
  comment_cmnttype_id as comment_type,
  comment_text as "text",
  comment_public as is_public
  -- sql query...  AS can_update - value derived from role(s) privileges, etc...(not implemented yet)
from "comment"
where ( comment_source = 'TA' );

-- insert rule

create or replace rule "_CREATE" as on insert to xm.project_task_comment
  do instead

insert into "comment" (
  comment_id,
  comment_source_id,
  comment_source,
  comment_date,
  comment_user,
  comment_cmnttype_id,
  comment_text,
  comment_public )
values (
  new.id,
  new.project_task,
  'TA',
  new.date,
  new.user,
  new.comment_type,
  new.text,
  new.is_public );

-- update rule

create or replace rule "_UPDATE" as on update to xm.project_task_comment
  do instead

update "comment" set
  comment_text = new.text
where ( comment_id  = old.id );

-- delete rule
create or replace rule "_DELETE" as on delete to xm.project_task_comment
  do instead nothing;

