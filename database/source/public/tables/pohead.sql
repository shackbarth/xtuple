-- add uuid column here because we need it on the client
select xt.add_column('pohead','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('pohead', 'xt.obj');
select xt.add_constraint('pohead', 'pohead_obj_uui_id','unique(obj_uuid)', 'public');

-- Leaving out this functionality to create 'default' workflows for PO's because of the potype issue.
-- See the comment in createwf_after_insert trigger function for more info.
-- auto workflow generation trigger
-- drop trigger if exists powf_after_insert on pohead;
-- create trigger powf_after_insert after insert on pohead for each row
--  execute procedure xt.createwf_after_insert();