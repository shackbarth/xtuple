-- add uuid column here because there are views that need this
select xt.add_column('quitem','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');

-- trigger
drop trigger if exists quitem_taxtype_change on quitem;
create trigger quitem_taxtype_change after insert or update on quitem for each row execute procedure xt.taxtype_record_did_change();
