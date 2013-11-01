select xt.create_view('xt.resource', $$

select emp_code as resource_code, emp_name as resource_name, obj_uuid from emp
union all
select usr_username, usr_propername, obj_uuid from xt.usrlite
union all
select empgrp_name, empgrp_descrip, obj_uuid from empgrp;

$$, false);
