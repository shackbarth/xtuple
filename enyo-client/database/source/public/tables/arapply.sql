-- add uuid column here because there are views that need this
select xt.add_column('arapply','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
select xt.add_inheritance('arapply', 'xt.obj');
select xt.add_constraint('arapply', 'arapply_obj_uuid_id','unique(obj_uuid)', 'public');