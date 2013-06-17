-- trigger
drop trigger if exists incdt_owner_change on incdt;
create trigger indct_owner_change after insert on incdt for each row execute procedure xt.owner_record_did_change();

-- add uuid column here because there are views that need this
select xt.add_column('incdt','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
