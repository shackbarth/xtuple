select xt.create_view('xt.tskresourceanalysis', $$

select resource_name, prjtask_hours_budget, row_number() OVER ()
from xt.tskresource
left join prjtask on tskresource_prjtask_id = prjtask_id
left join xt.resource on tskresource_resource_id = xt.resource.obj_uuid

$$, false);

