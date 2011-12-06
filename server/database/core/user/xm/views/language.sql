select dropIfExists('VIEW', 'language', 'xm');

-- return rule

create or replace view xm.language as 

select
  lang_id as id,
  lang_name as name,
  lang_abbr2 as abbreviation_short,
  lang_abbr3 as abbreviation_long
from public.lang;

-- insert rule

create or replace rule "_CREATE" as on insert to xm.language
  do instead nothing;
  
-- update rule

create or replace rule "_UPDATE" as on update to xm.language
  do instead nothing;

-- delete rules

create or replace rule "_DELETE" as on delete to xm.language
  do instead nothing;
