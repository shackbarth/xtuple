-- add uuid column here because there are views that need this
select xt.add_column('docass','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
select xt.add_inheritance('docass', 'xt.obj');
select xt.add_constraint('docass', 'docass_obj_uui_id','unique(obj_uuid)', 'public');