-- add uuid column here because there are views that need this
select xt.add_column('invcitem','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('invcitem', 'xt.obj');
select xt.add_constraint('invcitem', 'invcitem_obj_uuid','unique(obj_uuid)', 'public');
