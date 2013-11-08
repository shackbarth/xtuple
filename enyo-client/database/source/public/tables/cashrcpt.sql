select xt.add_column('cashrcptitem', 'obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
select xt.add_inheritance('cashrcptitem', 'xt.obj');
select xt.add_constraint('cashrcptitem', 'cashrcptitem_obj_uuid', 'unique(obj_uuid)', 'public');
