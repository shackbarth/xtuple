-- trigger
drop trigger if exists todoitem_owner_change on todoitem;
create trigger todoitem_owner_change after insert on todoitem for each row execute procedure xt.owner_record_did_change();

-- add uuid column here because there are views that need this
select xt.add_column('todoitem','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
