-- trigger
drop trigger if exists ophead_owner_change on ophead;

-- add uuid column here because there are views that need this
select xt.add_column('ophead','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('ophead', 'xt.obj');
select xt.add_constraint('ophead', 'ophead_obj_uui_id','unique(obj_uuid)', 'public');

create trigger ophead_owner_change after insert on ophead for each row execute procedure xt.owner_record_did_change();
