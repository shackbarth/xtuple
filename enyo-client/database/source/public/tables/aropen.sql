-- add uuid column here because there are views that need this
select xt.add_column('aropen','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
select xt.add_inheritance('aropen', 'xt.obj');
select xt.add_constraint('aropen', 'aropen_obj_uuid_id','unique(obj_uuid)', 'public');