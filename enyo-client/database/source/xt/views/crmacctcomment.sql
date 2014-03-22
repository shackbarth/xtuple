select xt.create_view('xt.crmacctcomment', $$

    -- Account comments
    select comment_id, comment_source_id, comment_date, comment_user, comment_text, comment_cmnttype_id, comment_source, comment_public, comment.obj_uuid
    from comment
      left join cmnttype on (comment_cmnttype_id=cmnttype_id)
    where (comment_source='CRMA')
    union
    -- Customer comments
    select comment_id, crmacct_id, comment_date, comment_user, comment_text, comment_cmnttype_id, comment_source, comment_public, comment.obj_uuid
    from comment
      join crmacct on (comment_source_id=crmacct_cust_id)
    where (comment_source='C')
    union
    -- Vendor comments
    select comment_id, crmacct_id, comment_date, comment_user, comment_text, comment_cmnttype_id, comment_source, comment_public, comment.obj_uuid
    from comment
      join crmacct on (comment_source_id=crmacct_vend_id)
    where (comment_source='V')
    union
    -- Contact comments
    select comment_id, crmacct_id, comment_date, comment_user, comment_text, comment_cmnttype_id, comment_source, comment_public, comment.obj_uuid
    from comment
      join cntct on (comment_source_id=cntct_id)
      join crmacct on (cntct_crmacct_id=crmacct_id)
    where (comment_source='T');

$$, false);

-- insert rules

create or replace rule "_CREATE" as on insert to xt.crmacctcomment
  do instead

  insert into comment (
    comment_id,
    comment_source_id,
    comment_date,
    comment_user,
    comment_text,
    comment_cmnttype_id,
    comment_source,
    comment_public,
    obj_uuid
  ) values (
    new.comment_id,
    new.comment_source_id,
    new.comment_date,
    new.comment_user,
    new.comment_text,
    new.comment_cmnttype_id,
    'CRMA',
    new.comment_public,
    new.obj_uuid
  );

create or replace rule "_UPDATE" as on update to xt.crmacctcomment
  do instead

  update comment set
    comment_text=new.comment_text,
    comment_public=new.comment_public,
    obj_uuid = new.obj_uuid
  where comment_id=old.comment_id;

-- delete rules

create or replace rule "_DELETE" as on delete to xt.crmacctcomment
  do instead nothing;
