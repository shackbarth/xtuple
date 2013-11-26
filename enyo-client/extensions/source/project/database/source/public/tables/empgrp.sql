-- add uuid column here because there are views that need this
select xt.add_column('empgrp','obj_uuid', 'uuid', 'default xt.uuid_generate_v4()', 'public');
select xt.add_inheritance('empgrp', 'xt.obj');
select xt.add_constraint('empgrp', 'empgrp_obj_uui_id','unique(obj_uuid)', 'public');
