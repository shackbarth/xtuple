-- drop view xt.aropenid cascade
create or replace view xt.aropenid as
select
  aropen_id,
  aropen_cust_id,
  aropen_docdate,
  aropen_duedate,
  aropen_doctype,
  aropen_docnumber,
  aropen_amount,
  aropen_curr_id,
  aropen_curr_rate
from aropen
where aropen_open
  and aropen_doctype in ('I','D');

grant all on table xt.aropenid to xtrole;
comment on view xt.aropenid is 'open receivable debits';

create or replace rule "_INSERT" as on insert to xt.aropenid do instead nothing;

create or replace rule "_UPDATE" as on update to xt.aropenid do instead nothing;

create or replace rule "_DELETE" as on delete to xt.aropenid do instead nothing;
