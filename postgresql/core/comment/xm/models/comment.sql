select private.create_model(

-- Model name, schema 

'comment', 'public', 'comment',

-- Columns

E'{
  "comment.comment_id as guid",
  "comment.comment_source_id as source_id",
  "comment.comment_source as source",
  "comment.comment_date as date",
  "comment.comment_user as username",
  "comment.comment_cmnttype_id as comment_type",
  "comment.comment_text as text",
  "comment.comment_public as is_public"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.comment
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
  new.guid,
  new.source_id,
  new.source,
  new.date,
  new.username,
  new.comment_type,
  new.text,
  new.is_public );

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.comment
  do instead

update public.comment set
  comment_text = new.text,
  comment_public = new.is_public
where ( comment_id = old.guid );

","

create or replace rule \\"_UPDATE_CHECK_PRIV\\" as on update to xm.comment
   where (select case when not cmnttype_editable then true
                      when (checkPrivilege(\'EditOwnComments\') and old.username = getEffectiveXtUser()) then false
                      when (checkPrivilege(\'EditOthersComments\') and old.username != getEffectiveXtUser()) then false
                      else true end
          from cmnttype
          where cmnttype_id = old.comment_type) do instead

  select private.raise_exception(\'You are not allowed to update this comment\');

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.comment
  do instead NOTHING;

"}',

-- Conditions, Order, Comment, System, Nested

'{}', '{"date desc"}', 'Comment Model', true, true);