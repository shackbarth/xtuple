-- add uuid column here because there are views that need this
select xt.add_column('cmitemtax','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('cmitemtax', 'xt.obj');
select xt.add_constraint('cmitemtax', 'cmitemtax_obj_uuid','unique(obj_uuid)', 'public');
