select dropIfExists('VIEW', 'site_info', 'xm');

-- return rule

create or replace view xm.site_info as
  
select
  id,
  code, 
  is_active,
  site_type,
  description,
  address
from xm.site;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.site_info
  do instead nothing;
  
-- update rule

create or replace rule "_UPDATE" as on update to xm.site_info
  do instead nothing;
  
-- delete rules

create or replace rule "_DELETE" as on delete to xm.site_info   
  do instead nothing;