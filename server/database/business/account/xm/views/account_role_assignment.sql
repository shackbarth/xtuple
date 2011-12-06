select dropIfExists('VIEW', 'account_role_assignment', 'xm');

-- return rule

create or replace view xm.account_role_assignment as 

select
  crmacctroleass_id as id,
  crmacctroleass_crmacct_id as account,
  crmacctroleass_crmacctrole_id as account_role,
  crmacctroleass_target_id as target
from private.crmacctroleass;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.account_role_assignment
  do instead

insert into private.crmacctroleass (
  crmacctroleass_id,
  crmacctroleass_crmacct_id,
  crmacctroleass_crmacctrole_id,
  crmacctroleass_target_id )
values (
  new.id,
  new.account,
  new.account_role,
  new.target );

-- update rule

create or replace rule "_UPDATE" as on update to xm.account_role_assignment
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xm.account_role_assignment
  do instead (

delete from private.crmacctroleass
where ( crmacctroleass_id = old.id );

);
