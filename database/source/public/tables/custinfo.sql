-- add uuid column here because there are views that need this
select xt.add_column('custinfo','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('custinfo', 'xt.obj');
select xt.add_constraint('custinfo', 'custinfo_obj_uuid_id','unique(obj_uuid)', 'public');

-- always drop triggers before schema changes
drop trigger if exists customer_did_change on custinfo;

alter table public.custinfo alter column cust_creditstatus set default 'G';

-- add the trigger
create trigger customer_did_change before insert on custinfo for each row
  execute procedure xt.customer_did_change();

