select dropifexists('view', 'unit_type', 'xm');

-- return rule

create or replace view xm.unit_type as

select	
  uomtype_id as id,
  uomtype_name as "name",
  uomtype_descrip as description,
  uomtype_multiple as multiple
from uomtype;

-- insert rule

create or replace rule "_create" as on insert to xm.unit_type
  do instead nothing;

-- update rule

create or replace rule "_update" as on update to xm.unit_type
  do instead nothing;

-- delete rule

create or replace rule "_delete" as on delete to xm.unit_type
  do instead nothing;