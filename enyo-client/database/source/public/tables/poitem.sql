-- add uuid column here because we need it on the client
select xt.add_column('poitem','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('poitem', 'xt.obj');
select xt.add_constraint('poitem', 'poitem_obj_uui_id','unique(obj_uuid)', 'public');
