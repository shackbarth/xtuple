select dropIfExists('VIEW', 'opportunity_type', 'xm');

-- return rule

create or replace view xm.opportunity_type as

select 
  optype_id as id,
  optype_name as "name",
  optype_descrip as description
from optype;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.opportunity_type
  do instead

insert into optype (
  optype_id,
  optype_name,
  optype_descrip )
values (
  new.id,
  new.name,
  new.description );

-- update rule

create or replace rule "_update" as on update to xm.opportunity_type
  do instead

update optype set
  optype_name = new.name,
  optype_descrip = new.description
where ( optype_id = old.id );

-- delete rule

create or replace rule "_DELETE" as on delete to xm.opportunity_type
  do instead

delete from optype
where ( optype_id = old.id );