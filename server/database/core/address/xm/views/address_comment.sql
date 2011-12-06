select dropIfExists('VIEW', 'address_comment', 'xm');

-- return rule

create or replace view xm.address_comment as 

select
  comment_id as id,
  comment_source_id as address,
  comment_date as date,
  comment_user as username,
  comment_cmnttype_id as comment_type,
  comment_text as text,
  comment_public as is_public
from public.comment
where ( comment_source = 'ADDR' );

-- insert rule

create or replace rule "_CREATE" as on insert to xm.address_comment 
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
  new.address,
  'ADDR',
  new.date,
  new.username,
  new.comment_type,
  new.text,
  new.is_public );

-- update rule

create or replace rule "_UPDATE" as on update to xm.address_comment 
  do instead

update public.comment set
  comment_text = new.text
where ( comment_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.address_comment 
  do instead nothing;
