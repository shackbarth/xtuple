select dropIfExists('VIEW', 'incident_category', 'xm');

-- return rule

create or replace view xm.incident_category as

select 
  incdtcat_id as id,
  incdtcat_descrip as description,
  incdtcat_name as name,
  incdtcat_order as order
from incdtcat;  

-- insert rule

create or replace rule "_CREATE" as on insert to xm.incident_category 
  do instead

insert into incdtcat (
  incdtcat_id,
  incdtcat_descrip,
  incdtcat_name,
  incdtcat_order )
values (
  new.id,
  new.description,
  new.name,
  new.order );
  
-- update rule

create or replace rule "_UPDATE" as on update to xm.incident_category
  do instead
  
update incdtcat set
  incdtcat_descrip = new.description,
  incdtcat_name = new.name,
  incdtcat_order = new.order 
where ( incdtcat_id = old.id );
  
-- delete rules

create or replace rule "_DELETE" as on delete to xm.incident_category   
  do instead
  
delete from incdtcat 
where ( incdtcat_id = old.id );