select dropIfExists('VIEW','privgranted');
create view privgranted as 
select 
  priv_name as privilege,
  coalesce(usrpriv_priv_id, grppriv_priv_id, -1) > 0 as granted,
  priv_seq as sequence
from priv
 left outer join usrpriv on (priv_id=usrpriv_priv_id) and (usrpriv_username=getEffectiveXtUser())
 left outer join (
   select distinct grppriv_priv_id
   from grppriv
   join usrgrp on (grppriv_grp_id=usrgrp_grp_id) and (usrgrp_username=getEffectiveXtUser())
 ) grppriv on (grppriv_priv_id=priv_id);

grant all on table privgranted to xtrole;
