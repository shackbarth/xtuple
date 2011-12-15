select dropIfExists('VIEW', 'incident_severity', 'xm');

-- return rule

create or replace view xm.incident_severity as
  
select
  incdtseverity_id as id,
  incdtseverity_name as name,
  incdtseverity_order as order,
  incdtseverity_descrip as description
from incdtseverity;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.incident_severity 
  do instead

insert into incdtseverity (
  incdtseverity_id,
  incdtseverity_name,
  incdtseverity_order,
  incdtseverity_descrip )
values (
  new.id,
  new.name,
  new.order,
  new.description );
  
-- update rule

create or replace rule "_UPDATE" as on update to xm.incident_severity
  do instead
  
update incdtseverity set
  incdtseverity_id = new.id,
  incdtseverity_name = new.name,
  incdtseverity_order = new.order,
  incdtseverity_descrip = new.description
where ( incdtseverity_id = old.id );
  
-- delete rules

create or replace rule "_DELETE" as on delete to xm.incident_severity   
  do instead
  
delete from incdtseverity 
where ( incdtseverity_id = old.id );