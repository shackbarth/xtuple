drop view if exists xc.useruserrole cascade;
create or replace view xc.useruserrole as

select usrgrp_id as useruserrole_id,
  usrgrp_grp_id as useruserrole_userrole_id,
  usrgrp_username as useruserrole_username
from public.usrgrp;

grant all on table xc.useruserrole to xtrole;
