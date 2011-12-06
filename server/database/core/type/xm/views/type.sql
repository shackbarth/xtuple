select dropIfExists('VIEW', 'type', 'xm');

-- return rule

create or replace view xm.type as 

select
  datatype_id as id,
  datatype_name as name,
  datatype_descrip as description
from private.datatype;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.type
  do instead

insert into private.datatype (
  datatype_id,
  datatype_name,
  datatype_descrip )
values (
  new.id,
  new.name,
  new.description );

-- update rule

create or replace rule "_UPDATE" as on update to xm.type
  do instead

update private.datatype set
  datatype_name = new.name
where ( datatype_id = old.id );

-- delete rules

create or replace rule "_DELETE" as on delete to xm.type
  do instead 
  
delete from private.datatype
where ( datatype_id = old.id );
