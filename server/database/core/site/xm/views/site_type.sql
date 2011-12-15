select dropIfExists('VIEW', 'site_type', 'xm');

-- return rule

create or replace view xm.site_type as
  
select
  sitetype_id as id,
  sitetype_name as "name",
  sitetype_descrip as description
from sitetype;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.site_type
  do instead

insert into sitetype (
  sitetype_id,
  sitetype_name,
  sitetype_descrip )
values (
  new.id,
  new.name,
  new.description );
  
-- update rule

create or replace rule "_UPDATE" as on update to xm.site_type
  do instead
  
update sitetype set 
  sitetype_name = new.name,
  sitetype_descrip = new.description
where ( sitetype_id = old.id );
  
-- delete rules

create or replace rule "_DELETE" as on delete to xm.site_type   
  do instead
  
delete from sitetype 
where ( sitetype_id = old.id );