-- trigger
drop trigger if exists indct_owner_change on public.incdt;
create trigger indct_owner_change after insert on public.incdt for each row execute procedure xt.owner_record_did_change();

-- add uuid column here because there are views that need this
select xt.add_column('incdt','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('incdt', 'xt.obj');
select xt.add_constraint('incdt', 'incdt_obj_uui_id','unique(obj_uuid)', 'public');

-- because it was missed at one point
update incdt set obj_uuid = xt.uuid_generate_v4() where obj_uuid is null;
