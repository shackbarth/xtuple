-- add uuid column here because there are views that need this
select xt.add_column('coitem','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('coitem', 'xt.obj');
select xt.add_constraint('coitem', 'coitem_obj_uuid','unique(obj_uuid)', 'public');

-- trigger
drop trigger if exists coitem_taxtype_change on coitem;
create trigger coitem_taxtype_change after insert or update on coitem for each row execute procedure xt.taxtype_record_did_change();
