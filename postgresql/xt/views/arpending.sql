-- drop view xt.arpending cascade
create or replace view xt.arpending as
  -- pending cash receipts
  select 
    cashrcptitem_id as arpending_id,
    'R'::text as arpending_type,
    cashrcptitem_aropen_id as arpending_aropen_id,
    round(currtocurr(cashrcpt_curr_id,aropen_curr_id,(cashrcptitem_amount + cashrcptitem_discount),cashrcpt_applydate) * case when aropen_doctype in ('I','D') then 1 else -1 end,2) as arpending_amount
  from cashrcptitem 
    join cashrcpt on cashrcpt_id=cashrcptitem_cashrcpt_id
    join aropen on aropen_id=cashrcptitem_aropen_id
  where not cashrcpt_posted
    and not cashrcpt_void
  union
  -- pending credit memo applications
  select
    arcreditapply_id as arpending_id,
    'C'::text as arpending_type,
    arcreditapply_target_aropen_id as arpending_aropen_id,
    round(currToCurr(arcreditapply_curr_id, aropen_curr_id, arcreditapply_amount, current_date),2) as arpending_amount
  from arcreditapply
    join aropen on aropen_id=arcreditapply_target_aropen_id;

grant all on table xt.arpending to xtrole;
comment on view xt.arpending is 'receivable pending applications';

create or replace rule "_INSERT" as on insert to xt.arpending do instead nothing;

create or replace rule "_UPDATE" as on update to xt.arpending do instead nothing;

create or replace rule "_DELETE" as on delete to xt.arpending do instead nothing;