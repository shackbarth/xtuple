select dropIfExists('VIEW', 'characteristic_role', 'xm');

-- return rule

create or replace view xm.characteristic_role as 

select
  charrole_id as id,
  charrole_datatype_id as type
from private.charrole;

-- Available Characteristic Roles are defined by the application. Should be no
-- need for users to ever edit these.

-- insert rule

create or replace rule "_CREATE" as on insert to xm.characteristic_role
  do instead nothing;

-- update rule

create or replace rule "_UPDATE" as on update to xm.characteristic_role
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xm.characteristic_role
  do instead nothing;
