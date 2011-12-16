select dropIfExists('VIEW', 'opportunity_stage', 'xm');

-- return rule

create or replace view xm.opportunity_stage as

select 
  opstage_id as id,
  opstage_name as "name",
  opstage_descrip as description,
  opstage_opinactive as deactivate
from opstage;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.opportunity_stage
  do instead

insert into opstage (
  opstage_id,
  opstage_name,
  opstage_descrip,
  opstage_opinactive )
values (
  new.id,
  new.name,
  new.description,
  new.deactivate );

-- update rule

create or replace rule "_update" as on update to xm.opportunity_stage
  do instead

update opstage set
  opstage_name = new.name,
  opstage_descrip = new.description,
  opstage_opinactive = new.deactivate
where ( opstage_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.opportunity_stage
  do instead

delete from opstage
where ( opstage_id = old.id );