select dropIfExists('VIEW', 'user_info', 'xm');

-- return rule

create or replace view xm.user_info as

select	
  username,
  is_active,
  propername
from xm.user;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.user_info
  do instead nothing;

-- update rule

create or replace rule "_UPDATE" as on update to xm.user_info
  do instead nothing;

-- delete rule

create or replace rule "_DELETE" as on delete to xm.user_info
  do instead nothing;