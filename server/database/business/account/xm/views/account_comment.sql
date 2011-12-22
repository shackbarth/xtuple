select private.create_model(

-- Model name, schema, table
'account_comment', 'public', 'crmacct',

-- Columns
E'{
  "comment.comment_id as id"
  "comment_source_id as account",
  "comment_date as date",
  "comment_user as username",
  "comment_cmnttype_id as comment_type",
  "comment_text as text",
  "comment_public as is_public"}',

-- Rules
E'{}',

-- Conditions, Comment, System
'{"comment_source = \'CRMA\'"}', 'Account Comment Model', true);

/*

select dropIfExists('VIEW', 'account_comment', 'xm');

-- return rule

create or replace view xm.account_comment as 

select
  comment_id as id,
  comment_source_id as account,
  comment_date as date,
  comment_user as username,
  comment_cmnttype_id as comment_type,
  comment_text as text,
  comment_public as is_public
from comment
where ( comment_source = 'CRMA' );

-- insert rule

create or replace rule "_CREATE" as on insert to xm.account_comment 
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
  'CRMA',
  new.date,
  new.username,
  new.comment_type,
  new.text,
  new.is_public );

-- update rule

create or replace rule "_UPDATE" as on update to xm.account_comment 
  do instead

update comment set
  comment_text = new.text
where ( comment_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.account_comment 
  do instead nothing;

*/
