drop view if exists xc.userrolepriv cascade;
create or replace view xc.userrolepriv as

select grppriv_id as userrolepriv_id,
  grppriv_grp_id as userrolepriv_userrole_id,
  grppriv_priv_id as userrolepriv_priv_id
from public.grppriv;

grant all on table xc.userrolepriv to xtrole;
