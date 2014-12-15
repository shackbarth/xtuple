-- add uuid column here because there are views that need this
select xt.add_column('wo','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('wo', 'xt.obj');
select xt.add_constraint('wo', 'wo_obj_uuid','unique(obj_uuid)', 'public');

-- auto workflow generation trigger
drop trigger if exists wowf_after_insert on wo;
create trigger wowf_after_insert after insert on wo for each row
  execute procedure xt.createwf_after_insert();

ALTER TABLE wo DISABLE TRIGGER wowf_after_insert;