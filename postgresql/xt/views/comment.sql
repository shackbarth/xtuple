create or replace view xt.comment as 
select
  comment_id,
  comment_source_id,
  comment_source,
  comment_date,
  comment.comment_user,
  comment_cmnttype_id,
  comment_text,
  comment_public
from comment
order by comment_date desc;

-- insert rule

create or replace rule "_CREATE" as on insert to xt.comment
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
  new.comment_id,
  new.comment_source_id,
  new.comment_source,
  new.comment_date,
  new.comment_user,
  new.comment_cmnttype_id,
  new.comment_text,
  new.comment_public );

-- update rule

create or replace rule "_UPDATE" as on update to xt.comment
  do instead

update public.comment set
  comment_text = new.comment_text,
  comment_public = new.comment_public
where ( comment_id = old.comment_id );

create or replace rule "_UPDATE_CHECK_EDITABLE" as on update to xt.comment
   where (select not cmnttype_editable
          from cmnttype
          where cmnttype_id = old.comment_cmnttype_id) do instead

  select xt.raise_exception('You are not allowed to update this comment');

-- delete rule

create or replace rule "_DELETE" as on delete to xt.comment
  do instead nothing;

