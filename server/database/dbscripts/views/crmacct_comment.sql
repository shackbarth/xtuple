select dropIfExists('VIEW','crmacct_comment','xt');
create view xt.crmacct_comment as (
select 
  comment_id, 
  comment_date, 
  comment_source,
  comment_source_id,
  comment_cmnttype_id,
  comment_user,
  comment_text, 
  comment_public,
  null as cntct_name
from comment
where (comment_source='CRMA') 
union all
select 
  comment_id, 
  comment_date, 
  'CRMA' as comment_source,
  crmacct_id as comment_source_id,
  comment_cmnttype_id,
  comment_user,
  comment_text, 
  comment_public,
  null as cntct_name
from comment
  join crmacct on (crmacct_cust_id = comment_source_id)
               and (comment_source = 'C')
union all
select
  comment_id, 
  comment_date, 
  'CRMA' as comment_source,
  crmacct_id as comment_source_id,
  comment_cmnttype_id,
  comment_user,
  comment_text, 
  comment_public,
  null as cntct_name
from comment
  join crmacct on (crmacct_vend_id = comment_source_id)
               and (comment_source = 'V')
union all
select 
  comment_id, 
  comment_date, 
  'CRMA' as comment_source,
  cntct_crmacct_id as comment_source_id,
  comment_cmnttype_id,
  comment_user,
  comment_text, 
  comment_public,
  cntct_name
from comment
  join cntct on (cntct_id = comment_source_id)
             and (comment_source = 'T')
where (cntct_crmacct_id is not null)
);

grant all on table xt.crmacct_comment to xtrole;
comment on view xt.crmacct_comment IS 'View of all comments, including contact comments, associated with a crm account.';

-- Rules

create or replace rule "_insert" as
  on insert to xt.crmacct_comment do instead

insert into public.comment (
  comment_id,
  comment_date,
  comment_source,
  comment_source_id,
  comment_cmnttype_id,
  comment_user,
  comment_text,
  comment_public )
values (
  new.comment_id,
  new.comment_date,
  new.comment_source,
  new.comment_source_id,
  new.comment_cmnttype_id,
  new.comment_user,
  new.comment_text,
  new.comment_public
);

create or replace rule "_update" as
  on update to xt.crmacct_comment do instead

update public.comment set
  comment_text = new.comment_text,
  comment_public = new.comment_public
where comment_id = old.comment_id;



