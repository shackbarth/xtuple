-- add uuid column here because we need it on the client
select xt.add_column('pohead','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('pohead', 'xt.obj');
select xt.add_constraint('pohead', 'pohead_obj_uui_id','unique(obj_uuid)', 'public');
