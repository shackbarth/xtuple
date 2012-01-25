select private.create_model(

-- Model name, schema, table

'site_comment', 'xm', 'comment',

-- Columns

E'{
  "comment.guid as guid",
  "comment.source_id as site",
  "comment.date as date",
  "comment.username as username",
  "comment.comment_type as comment_type",
  "comment.text as text",
  "comment.is_public as is_public"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.site_comment 
  do instead

insert into xm.comment (
  guid,
  source_id,
  source,
  date,
  username,
  comment_type,
  text,
  is_public )
values (
  new.guid,
  new.site,
  \'WH\',
  new.date,
  new.username,
  new.comment_type,
  new.text,
  new.is_public );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.site_comment
  do instead
  
update xm.comment set
  text = new.text,
  is_public = new.is_public
where ( guid = old.guid );

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.site_comment   
  do instead nothing;

"}',

-- Conditions, Comment, System

E'{"comment.source = \'WH\'"}', 'Site Comment Model', true, true);
