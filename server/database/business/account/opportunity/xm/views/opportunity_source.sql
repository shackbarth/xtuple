select dropIfExists('VIEW', 'opportunity_source', 'xm');

-- return rule

create or replace view xm.opportunity_source as

select 
  opsource_id as id,
  opsource_name as "name",
  opsource_descrip as description
from opsource;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.opportunity_source
  do instead

insert into opsource (
  opsource_id,
  opsource_name,
  opsource_descrip )
values (
  new.id,
  new.name,
  new.description );

-- update rule

create or replace rule "_UPDATE" as on update to xm.opportunity_source
  do instead

update opsource set
  opsource_name = new.name,
  opsource_descrip = new.description
where ( opsource_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.opportunity_source
  do instead

delete from opsource
where ( opsource_id = old.id );