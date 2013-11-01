-- add uuid column here because there are views that need this
select xt.add_column('emp','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
select xt.add_inheritance('emp', 'xt.obj');
select xt.add_constraint('emp', 'emp_obj_uui_id','unique(obj_uuid)', 'public');
