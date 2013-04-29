
insert into xt.userrolepriv
select src.grppriv_id, grppriv_grp_id, grppriv_priv_id
from grppriv src
  join priv on priv_id=grppriv_priv_id
where not exists (
  select chk.userrolepriv_id
  from xt.userrolepriv chk
  where chk.userrolepriv_id=src.grppriv_id
);
