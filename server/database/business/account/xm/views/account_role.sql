select dropIfExists('VIEW', 'account_role', 'xm');

-- return rule

create or replace view xm.account_role as 

select
  crmacctrole_id as id,
  crmacctrole_datatype_id as type
from private.crmacctrole;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.account_role
  do instead

insert into private.crmacctrole (
  crmacctrole_id,
  crmacctrole_datatype_id )
values (
  new.id,
  new.type );

-- update rule

create or replace rule "_UPDATE" as on update to xm.account_role
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xm.account_role
  do instead (

delete from private.crmacctrole
where ( crmacctrole_id = old.id );

);
