select private.create_model(

-- Model name, schema

'project_comment', '',

-- Table

E'(select
  comment_id as guid,
  comment_source_id as project,
  comment_date as date,
  comment_user as user,
  comment_cmnttype_id  as comment_type,
  comment_text as text,
  comment_public as is_public,
  cmnttype_editable as can_update
  from comment
  join cmnttype on comment_cmnttype_id = cmnttype_id) cmt',

-- Columns

E'{
  "cmt.guid",
  "cmt.project",
  "cmt.date",
  "cmt.user",
  "cmt.comment_type",
  "cmt.text",
  "cmt.is_public",
  "cmt.can_update"}',

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.project_comment
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
  new.project,
  \'J\',
  new.date,
  new.user,
  new.comment_type,
  new.text,
  new.is_public );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.project_comment
  do instead

update comment set
  comment_text = new.text,
  comment_public = new.is_public
where ( comment_id = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.project_comment
  do instead NOTHING;

"}',

-- Conditions, Comment, System

'{"comment_source = \'J\'"}', 'Project Comment Model', true);