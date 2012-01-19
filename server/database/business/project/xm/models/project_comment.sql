select private.create_model(

-- Model name, schema, table

'project_comment', 'xm', 'comments',

-- Columns

E'{
  "comments.guid as guid",
  "comments.source_id as project",
  "comments.date as date",
  "comments.username as username",
  "comments.comment_type as comment_type",
  "comments.text as text",
  "comments.is_public as is_public",
  "comments.can_update as can_update"}',

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.project_comment
  do instead

insert into xm.comments (
  guid,
  source_id,
  source,
  date,
  username,
  comment_type,
  text,
  is_public)
values (
  new.guid,
  new.project,
  \'J\',
  new.date,
  new.username,
  new.comment_type,
  new.text,
  new.is_public );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.project_comment
  do instead

update xm.comments set
  text = new.text,
  is_public = new.is_public
where ( guid = old.guid );

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.project_comment
  do instead NOTHING;

"}',

-- Conditions, Comment, System

E'{"comments.source = \'J\'"}', 'Project Comment Model', true,true);