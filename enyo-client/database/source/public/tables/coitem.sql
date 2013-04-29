-- add uuid column here because there are views that need this
select xt.add_column('coitem','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');