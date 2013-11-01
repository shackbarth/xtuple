-- trigger
drop trigger if exists prj_owner_change on prj;

-- add uuid column here because there are views that need this
select xt.add_column('prj','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
select xt.add_inheritance('prj', 'xt.obj');
select xt.add_constraint('prj', 'prj_obj_uui_id','unique(obj_uuid)', 'public');

create trigger prj_owner_change after insert on prj for each row execute procedure xt.owner_record_did_change();
