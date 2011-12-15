select dropIfExists('VIEW', 'project_info', 'xm');

-- return rule

create or replace view xm.project_info as

select 
  id,
  "number",
  "name",
  project_status
from xm.project;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.project_info
  do instead nothing;

-- update rule
  
create or replace rule "_UPDATE" as on update to xm.project_info
  do instead nothing;

-- delete rule
  
create or replace rule "_DELETE" as on delete to xm.project_info
  do instead nothing;