-- drop view xt.apapply cascade
create or replace view xt.apapply as
  select 
    apapply_id, 
    apapply_vend_id,
    apapply_target_apopen_id as apopen_id,
    case when (apapply_source_doctype='C') THEN '_creditMemo'
         when (apapply_source_doctype='K') THEN '_check'
         else '_other'
    end as doctype,
    apapply_source_docnumber, 
    apapply_postdate, 
    apapply_amount,
    apapply_curr_id,
    apapply_target_paid,
    apapply_username,
    true as source
  from apapply 
    join apopen on apopen_id=apapply_target_apopen_id
  where apopen_doctype in ('V','D')
  union
  select 
    apapply_id, 
    apapply_vend_id,
    apapply_source_apopen_id as apopen_id,
    case when (apapply_target_doctype='V') THEN '_voucher'
         when (apapply_target_doctype='D') THEN '_debitMemo'
         else '_other'
    end as doctype,
    apapply_target_docnumber as docnumber,
    apapply_postdate, 
    apapply_amount,
    apapply_curr_id,
    apapply_target_paid,
    apapply_username,
    false as source
  from apapply 
    join apopen on apopen_id=apapply_source_apopen_id
  where apopen_doctype = 'C'
  order by apapply_postdate;

grant all on table xt.apapply to xtrole;
comment on view xt.apapply is 'receivable applications';

create or replace rule "_INSERT" as on insert to xt.apapply do instead nothing;

create or replace rule "_UPDATE" as on update to xt.apapply do instead nothing;

create or replace rule "_DELETE" as on delete to xt.apapply do instead nothing;