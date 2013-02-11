
insert into xt.userrole
select *
from grp src
where not exists (
  select chk.userrole_id
  from xt.userrole chk
  where chk.userrole_id=src.grp_id
);
