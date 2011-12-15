select dropIfExists('VIEW', 'site_zone', 'xm');

-- return rule

create or replace view xm.site_zone as
  
select
  whsezone_id as id,
  whsezone_warehous_id as warehous_id,
  whsezone_name as "name",
  whsezone_descrip as description
from whsezone;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.site_zone
  do instead

insert into whsezone (
  whsezone_id,
  whsezone_warehous_id,
  whsezone_name,
  whsezone_descrip )
values (
  new.id,
  new.warehous_id,
  new.name,
  new.description );
  
-- update rule

create or replace rule "_UPDATE" as on update to xm.site_zone
  do instead
  
update whsezone set
  whsezone_name = new.name,
  whsezone_descrip = new.description
where ( whsezone_id = old.id );
  
-- delete rules

create or replace rule "_DELETE" as on delete to xm.site_zone   
  do instead
  
delete from whsezone 
where ( whsezone_id = old.id );