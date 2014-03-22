select xt.add_column('cashrcptitem', 'obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('cashrcptitem', 'xt.obj');
select xt.add_constraint('cashrcptitem', 'cashrcptitem_obj_uuid', 'unique(obj_uuid)', 'public');
