select dropIfExists('VIEW', 'contact_info', 'xm');

-- return rule

create or replace view xm.contact_info as

select  
  id,
  job_title,
  phone,
  alternate,
  fax,
  primary_email,
  web_address,
  is_active,
  account,
  "owner"
from xm.contact;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.contact_info 
  do instead nothing;

-- update rule

create or replace rule "_UPDATE" as on update to xm.contact_info
  do instead nothing;
  
-- delete rules

create or replace rule "_DELETE" as on delete to xm.contact_info   
  do instead nothing;