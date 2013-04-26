-- add uuid column here because there are views that need this
select xt.add_column('incdt','obj_uuid', 'text', 'default xt.generateUUID()', 'public');