-- add uuid column here because there are views that need this
select xt.add_column('invcitemtax','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
select xt.add_inheritance('invcitemtax', 'xt.obj');
select xt.add_constraint('invcitemtax', 'invcitemtax_obj_uuid','unique(obj_uuid)', 'public');
