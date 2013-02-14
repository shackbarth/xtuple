
insert into xt.useruserrole
select *
from usrgrp src
where not exists (
  select chk.useruserrole_id
  from xt.useruserrole chk
  where chk.useruserrole_id=src.usrgrp_id
);
