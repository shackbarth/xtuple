-- add uuid column here because there are views that need this
select xt.add_column('cntct','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('cntct', 'xt.obj');
select xt.add_constraint('cntct', 'cntct_obj_uuid_id','unique(obj_uuid)', 'public');

-- trigger
drop trigger if exists cntct_owner_change on cntct;
create trigger cntct_owner_change after insert on cntct for each row execute procedure xt.owner_record_did_change();
