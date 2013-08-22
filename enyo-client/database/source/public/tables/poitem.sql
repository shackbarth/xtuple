-- add uuid column here because we need it on the client
select xt.add_column('poitem','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
