drop view if exists xc.userrole cascade;
create or replace view xc.userrole as

select grp_id as userrole_id,
  grp_name as userrole_name,
  grp_descrip as userrole_descrip
from public.grp;

grant all on table xc.userrole to xtrole;