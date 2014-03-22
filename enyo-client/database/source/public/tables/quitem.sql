-- add uuid column here because there are views that need this
select xt.add_column('quitem','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('quitem', 'xt.obj');
select xt.add_constraint('quitem', 'quitem_obj_uui_id','unique(obj_uuid)', 'public');

-- trigger
drop trigger if exists quitem_taxtype_change on quitem;
create trigger quitem_taxtype_change after insert or update on quitem for each row execute procedure xt.taxtype_record_did_change();
