-- drop view xt.aropencr cascade
create or replace view xt.aropencr as
select
  aropen_id,
  aropen_cust_id,
  aropen_docdate,
  aropen_doctype,
  aropen_docnumber,
  aropen_amount,
  aropen_curr_id,
  aropen_curr_rate
from aropen
where aropen_open
  and aropen_doctype in ('C','R');

grant all on table xt.aropencr to xtrole;
comment on view xt.aropencr is 'open receivable credits';

create or replace rule "_INSERT" as on insert to xt.aropencr do instead nothing;

create or replace rule "_UPDATE" as on update to xt.aropencr do instead nothing;

create or replace rule "_DELETE" as on delete to xt.aropencr do instead nothing;