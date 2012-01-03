select private.create_model(

-- Model name, schema, table
'item_comment', 'public', 'comment, cmnttype',

-- Columns
E'{
  "comment.comment_id as id",
  "comment.comment_source_id as item",
  "comment.comment_date as \\"date\\"",
  "comment.comment_user as \\"user\\"",
  "comment.comment_cmnttype_id as comment_type",
  "comment.comment_text as \\"text\\"",
  "comment.comment_public as is_public",
  "cmnttype.cmnttype_editable as can_update"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.item_comment 
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
  new.id,
  new.item,
  \'I\',
  new.date,
  new.user,
  new.comment_type,
  new.text,
  new.is_public );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.item_comment
  do instead
  
update comment set
  comment_text = new.text,
  comment_public = new.is_public
where ( comment_id = old.id );

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.item_comment   
  do instead nothing;

"}',

-- Conditions, Comment, System

E'{"comment.comment_cmnttype_id = cmnttype.cmnttype_id", "comment.comment_source = \'I\'"}', 'Item Comment Model', true);
