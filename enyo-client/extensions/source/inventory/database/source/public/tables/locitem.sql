-- add uuid column here because there are views that need this
select xt.add_column('locitem','obj_uuid', 'text', 'default xt.generate_uuid()', 'public');
select xt.add_inheritance('locitem', 'xt.obj');
select xt.add_constraint('locitem', 'locitem_obj_uui_id','unique(obj_uuid)', 'public');
