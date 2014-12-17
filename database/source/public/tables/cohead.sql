-- always drop triggers before schema changes
drop trigger if exists sales_order_did_change on cohead;

-- add uuid column here because there are views that need this
select xt.add_column('cohead','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('cohead', 'xt.obj');
select xt.add_constraint('cohead', 'cohead_obj_uuid','unique(obj_uuid)', 'public');

-- add the trigger
create trigger sales_order_did_change before insert on cohead for each row
  execute procedure xt.sales_order_did_change();

