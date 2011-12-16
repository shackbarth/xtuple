select dropIfExists('VIEW', 'account_info', 'xm');

-- return rule

create or replace view xm.account_info as

select	
  id,
  "number",
  "name",
  is_active
from xm.account;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.account_info 
  do instead nothing;


-- update rule

create or replace rule "_UPDATE" as on update to xm.account_info
  do instead nothing;
  
-- delete rules

create or replace rule "_DELETE" as on delete to xm.account_info   
  do instead nothing;