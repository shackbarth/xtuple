select xt.create_view('xt.resource', $$

select emp_code as resource_code,
coalesce(emp_name, emp_code) as resource_name,
obj_uuid
from emp
union all
--select usr_username,
--case when usr_propername like ''
--then usr_username
--else
--coalesce(usr_propername, usr_username) end as resource_name,
--obj_uuid
--from xt.usrlite
--union all
select empgrp_name,
coalesce(empgrp_descrip, empgrp_name),
obj_uuid
from empgrp;

$$, false);
