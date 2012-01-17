select private.create_model(

-- Model name, schema 

'comments', '',

-- Table

E'(select
     comment.comment_id as guid,
     comment.comment_source_id as source_id,
     comment.comment_source as source,
     comment.comment_date as date,
     comment.comment_user as username,
     comment.comment_cmnttype_id as comment_type,
     comment.comment_text as text,
     comment.comment_public as is_public,
     ((cmnttype.cmnttype_editable) 
      and (checkPrivilege(\'EditOwnComments\')) 
      and (checkPrivilege(\'EditOthersComments\'))) as can_update
   from comment, cmnttype
   where comment.comment_cmnttype_id = cmnttype.cmnttype_id) comments',

-- Columns

E'{
  "comments.guid as guid",
  "comments.source_id as source_id",
  "comments.source as source",
  "comments.date as date",
  "comments.username as username",
  "comments.comment_type as comment_type",
  "comments.text as text",
  "comments.is_public as is_public",
  "comments.can_update as can_update"
}',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.comments
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

create or replace rule \\"_UPDATE\\" as on update to xm.comments
  do instead

update public.comment set
  comment_text = new.text,
  comment_public = new.is_public
where ( comment_id = old.guid );

","

create or replace rule \\"_UPDATE_CHECK_PRIV\\" as on update to xm.comments
   where not checkPrivilege(\'EditOthersComments\')
    and not (select cmnttype.cmnttype_editable
             from cmnttype
             where cmnttype.cmnttype_id = old.comment_type)
    and not (checkPrivilege(\'EditOwnComments\') 
             and (old.username) = getEffectiveXtUser()
             and (new.username) = getEffectiveXtUser()) do instead

  select private.raise_exception(\'You do not have privileges to update this comment\');

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.comments
  do instead NOTHING;

"}',

-- Conditions, Comment, System, Nested

'{}', 'Comments Model', true, true);