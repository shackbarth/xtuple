select xt.add_column('cmitem', 'obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('cmitem', 'xt.obj');
select xt.add_constraint('cmitem', 'cmitem_obj_uuid', 'unique(obj_uuid)', 'public');
