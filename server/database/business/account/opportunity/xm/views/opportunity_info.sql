select dropIfExists('VIEW', 'opportunity_info', 'xm');

-- return rule

create or replace view xm.opportunity_info as

select 
  id,
  "number",
  "name",
  is_active
from xm.opportunity;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.opportunity_info
  do instead nothing;

-- update rule

create or replace rule "_UPDATE" as on update to xm.opportunity_info
  do instead nothing;

-- delete rule

create or replace rule "_DELETE" as on delete to xm.opportunity_info
  do instead nothing;