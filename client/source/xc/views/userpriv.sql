-- table definition
drop view if exists xc.userpriv cascade;
create or replace view xc.userpriv as

select usrpriv_id as userpriv_id,
  usrpriv_priv_id as userpriv_priv_id,
  usrpriv_username as userpriv_username
from public.usrpriv;

grant all on table xc.userpriv to xtrole;
