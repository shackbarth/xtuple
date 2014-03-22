select xt.create_view('xt.tskresourceanalysis', $$

select resource_name,  
tskresource_percent * prjtask_hours_budget as budgeted_hours,
tskresource_percent * prjtask_hours_actual as actual_hours, 
tskresource_percent * (prjtask_hours_budget - prjtask_hours_actual) as balance_hours, 
row_number() OVER ()
from xt.tskresource
left join prjtask on tskresource_prjtask_id = prjtask_id
left join xt.resource on tskresource_resource_id = xt.resource.obj_uuid

$$, false);

