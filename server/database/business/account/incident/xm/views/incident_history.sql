select dropIfExists('VIEW', 'incident_history', 'xm');

-- return rule

create or replace view xm.incident_history as
	
select 
	incdthist_id as id,
	incdthist_incdt_id as incident,
	incdthist_timestamp as timestamp,
	incdthist_username as username,
	incdthist_descrip as description
from incdthist;
	
-- insert rule

create or replace rule "_CREATE" as on insert to xm.incident_history 
	do instead

insert into incdthist (
	incdthist_id,
	incdthist_incdt_id,	
	incdthist_change,
    incdthist_target_id,
	incdthist_username,
	incdthist_timestamp,
	incdthist_descrip
)
values (
	new.id,
	new.incident,
	null,
	null,
	new.username,
	new.timestamp,
	new.description );

-- update rule

create or replace rule "_UPDATE" as on update to xm.incident_history
	do instead nothing;
	
-- delete rules

create or replace rule "_DELETE" as on delete to xm.incident_history	 
	do instead nothing;