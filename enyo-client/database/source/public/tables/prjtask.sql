-- trigger
drop trigger if exists prjtask_owner_change on prjtask;

-- add uuid column here because there are views that need this
select xt.add_column('prjtask','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('prjtask', 'xt.obj');
select xt.add_constraint('prjtask', 'prjtask_obj_uui_id','unique(obj_uuid)', 'public');

create trigger prjtask_owner_change after insert on prjtask for each row execute procedure xt.owner_record_did_change();
