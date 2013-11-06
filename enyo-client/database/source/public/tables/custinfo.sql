-- always drop triggers before schema changes
drop trigger if exists customer_did_change on custinfo;

alter table public.custinfo alter column cust_creditstatus set default 'G';

-- add the trigger
create trigger customer_did_change before insert on custinfo for each row
  execute procedure xt.customer_did_change();

