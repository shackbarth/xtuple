select dropIfExists('VIEW', 'opportunity_comment', 'xm');

-- return rule

create or replace view xm.opportunity_comment as

select 
  comment_id as id,
  comment_source_id as opportunity,
  comment_date as "date",
  comment_user as user,
  comment_cmnttype_id as comment_type,
  comment_text as "text",
  comment_public as is_public,
  cmnttype_editable as can_update
   -- comment_update  as can_update - value derived from role(s), privileges, etc...(not implemented yet))
from "comment"
  join cmnttype ON comment_cmnttype_id = cmnttype_id
where ( comment_source = 'OPP' );

-- insert rule

create or replace rule "_CREATE" as on insert to xm.opportunity_comment
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
values(
  new.id,
  new.opportunity,
  'OPP',
  new.date,
  new.user,
  new.comment_type,
  new.text,
  new.is_public );

-- update rule

create or replace rule "_UPDATE" as on update to xm.opportunity_comment
  do instead

update comment set
  comment_text = new.text,
  comment_public = new.is_public
where ( comment_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.opportunity_comment
  do instead nothing;