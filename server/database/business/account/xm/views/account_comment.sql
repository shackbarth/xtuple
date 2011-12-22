select private.create_model(

-- Model name, schema, table
'account_comment', 'public', 'comment',

-- Columns
E'{
  "comment_id as id",
  "comment_source_id as account",
  "comment_date as date",
  "comment_user as username",
  "comment_cmnttype_id as comment_type",
  "comment_text as text",
  "comment_public as is_public"}',

-- Rules
E'{"
-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.account_comment 
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
  new.account,
  \'CRMA\',
  new.date,
  new.username,
  new.comment_type,
  new.text,
  new.is_public );

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.account_comment 
  do instead

update comment set
  comment_text = new.text,
  comment_public = new.is_public
where ( comment_id = old.id );

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.account_comment 
  do instead nothing;
"}',

-- Conditions, Comment, System
E'{"comment_source = \'CRMA\'"}', 'Account Comment Model', true);
