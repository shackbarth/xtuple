select private.create_model(

-- Model name, schema, table

'contact_comment', 'public', 'comment',

-- Columns

E'{
  "comment.comment_id as id",
  "comment.comment_source_id as contact",
  "comment.comment_date as date",
  "comment.comment_user as username",
  "comment.comment_cmnttype_id as comment_type",
  "comment.comment_text as text",
  "comment.comment_public as is_public"}',

-- Rules

E'{"

-- insert rule

create or replace rule _CREATE as on insert to xm.contact_comment 
  do instead

insert into public.comment (
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
  new.contact,
  \'T\',
  new.date,
  new.username,
  new.comment_type,
  new.text,
  new.is_public );

","

-- update rule

create or replace rule _UPDATE as on update to xm.contact_comment 
  do instead

update public.comment set
  comment_text = new.text
where ( comment_id = old.id );

","

-- delete rule

create or replace rule _DELETE as on delete to xm.contact_comment 
  do instead nothing;

"}', 

-- Conditions, Comment, System
'{"comment_source = \'T\'"}', 'Contact Comment Model', true);
