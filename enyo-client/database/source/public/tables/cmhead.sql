select xt.add_column('cmhead', 'obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('cmhead', 'xt.obj');
select xt.add_constraint('cmhead', 'cmhead_obj_uuid', 'unique(obj_uuid)', 'public');
