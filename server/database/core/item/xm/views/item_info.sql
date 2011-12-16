select dropIfExists('VIEW', 'item_info', 'xm');

-- return rule

create or replace view xm.item_info as

select
  id,
  "number",
  description1,
  description2,
  "type",
  barcode,
  is_active
from xm.item;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.item_info
  do instead nothing;
  
-- update rule

create or replace rule "_UPDATE" as on update to xm.item_info
  do instead nothing;
  
-- delete rules

create or replace rule "_DELETE" as on delete to xm.item_info   
  do instead nothing;