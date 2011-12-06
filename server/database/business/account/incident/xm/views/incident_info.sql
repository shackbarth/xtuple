select dropIfExists('VIEW', 'incident_info', 'xm');

-- return rule

create or replace view xm.incident_info as
	
select
	id,
	number,
	is_active
from xm.incident;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.incident_info 
	do instead nothing;


-- update rule

create or replace rule "_UPDATE" as on update to xm.incident_info
	do instead nothing;
	
-- delete rules

create or replace rule "_DELETE" as on delete to xm.incident_info	 
	do instead nothing;