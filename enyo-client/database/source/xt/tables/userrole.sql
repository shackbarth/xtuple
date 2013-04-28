
insert into xt.userrole
select grp_id, grp_name, grp_descrip
from grp src
where not exists (
  select chk.userrole_id
  from xt.userrole chk
  where chk.userrole_id=src.grp_id
);
