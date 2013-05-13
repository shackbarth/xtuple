-- add uuid column here because there are views that need this
select xt.add_column('docass','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');