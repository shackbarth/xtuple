-- drop view xt.arapply cascade
create or replace view xt.arapply as
  select 
    arapply_id, 
    arapply_cust_id,
    arapply_target_aropen_id as aropen_id,
    case when (arapply_source_doctype = 'C') THEN '_creditMemo'
         when (arapply_source_doctype = 'R') THEN '_cashdeposit'
         when (arapply_fundstype='C') THEN '_check'
         when (arapply_fundstype='T') THEN '_certifiedCheck'
         when (arapply_fundstype='M') THEN '_masterCard'
         when (arapply_fundstype='V') THEN '_visa'
         when (arapply_fundstype='A') THEN '_americanExpress'
         when (arapply_fundstype='D') THEN '_discoverCard'
         when (arapply_fundstype='R') THEN '_otherCreditCard'
         when (arapply_fundstype='K') THEN '_cash'
         when (arapply_fundstype='W') THEN '_wireTransfer'
         when (arapply_fundstype='O') THEN '_other'
    end AS doctype,
    case when (arapply_source_doctype in ('C','R')) then arapply_source_docnumber
         when (arapply_source_doctype = 'K') then arapply_refnumber
         else '_other' 
    end as docnumber, 
    arapply_postdate, 
    arapply_distdate,
    arapply_applied,
    arapply_curr_id,
    arapply_target_paid,
    arapply_username,
    true as source
  from arapply 
    join aropen on aropen_id=arapply_target_aropen_id
  where aropen_doctype in ('I','D')
  union
  select 
    arapply_id, 
    arapply_cust_id,
    arapply_source_aropen_id as aropen_id,
    case when (arapply_target_doctype = 'I') THEN '_invoice'
         when (arapply_target_doctype = 'D') THEN '_debitMemo'
         when (arapply_target_doctype = 'K') THEN '_check'
         when (arapply_target_doctype = 'R') THEN '_cashreceipt'
         else '_other'
    end AS doctype,
    arapply_target_docnumber as docnumber,
    arapply_postdate, 
    arapply_distdate,
    arapply_applied,
    arapply_curr_id,
    arapply_target_paid,
    arapply_username,
    false as source
  from arapply 
    join aropen on aropen_id=arapply_source_aropen_id
  where aropen_doctype in ('C','R')
  order by arapply_postdate;

grant all on table xt.arapply to xtrole;
comment on view xt.arapply is 'receivable applications';

create or replace rule "_INSERT" as on insert to xt.arapply do instead nothing;

create or replace rule "_UPDATE" as on update to xt.arapply do instead nothing;

create or replace rule "_DELETE" as on delete to xt.arapply do instead nothing;