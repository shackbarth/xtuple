drop view if exists xt.unrec cascade;

-- Unreconciled on posted reconciliations
create or replace view xt.unrec as
select 
  jrnl_id, 
  this.bankrec_id,
  jrnl_date,
  jrnl_docnumber,
  jrnl_doctype,
  jrnl_notes,
  jrnl_amount
from xt.jrnl
  join bankaccnt on bankaccnt_accnt_id=jrnl_accnt_id
  join bankrec this on this.bankrec_bankaccnt_id=bankaccnt_id
  left outer join bankrecitem on bankrecitem_source_id=jrnl_id
  left outer join bankrec actual on actual.bankrec_id=bankrecitem_bankrec_id
  left outer join checkhead on jrnl_doctype='CK' 
              and jrnl_misc_id=checkhead_id
where this.bankrec_postdate < coalesce(actual.bankrec_postdate,endOfTime())
  and this.bankrec_postdate > jrnl_created
  and not coalesce(checkhead_void, false)
  and this.bankrec_posted
union all
-- Unreconciled on unposted reconcilation
select 
  jrnl_id, 
  this.bankrec_id,
  jrnl_date,
  jrnl_docnumber,
  jrnl_doctype,
  jrnl_notes,
  jrnl_amount
from xt.jrnl
  join bankaccnt on bankaccnt_accnt_id=jrnl_accnt_id
  join bankrec this on this.bankrec_bankaccnt_id=bankaccnt_id
  left outer join checkhead on jrnl_doctype='CK' 
              and jrnl_misc_id=checkhead_id
where not jrnl_rec
  and not this.bankrec_posted
  and not coalesce(checkhead_void, false)
except
-- Exclude cleared items
select 
  jrnl_id, 
  this.bankrec_id,
  jrnl_date,
  jrnl_docnumber,
  jrnl_doctype,
  jrnl_notes,
  jrnl_amount
from xt.jrnl
  join bankaccnt on bankaccnt_accnt_id=jrnl_accnt_id
  join bankrec this on this.bankrec_bankaccnt_id=bankaccnt_id
  join bankrecitem on bankrecitem_source_id=jrnl_id
  left outer join checkhead on jrnl_doctype='CK' 
              and jrnl_misc_id=checkhead_id
where not jrnl_rec
  and bankrecitem_cleared
  and not this.bankrec_posted
  and not coalesce(checkhead_void, false);

grant all on table xt.unrec to xtrole;

create or replace rule "_INSERT" as on insert to xt.unrec do instead nothing;

create or replace rule "_UPDATE" as on update to xt.unrec do instead nothing;

create or replace rule "_DELETE" as on delete to xt.unrec do instead nothing;
