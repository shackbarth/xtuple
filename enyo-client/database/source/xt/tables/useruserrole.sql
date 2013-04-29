
insert into xt.useruserrole
select src.usrgrp_id, usrgrp_grp_id, usrgrp_username
from usrgrp src
where not exists (
  select chk.useruserrole_id
  from xt.useruserrole chk
  where chk.useruserrole_id=src.usrgrp_id
);
