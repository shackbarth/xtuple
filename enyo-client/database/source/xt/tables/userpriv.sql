
insert into xt.userpriv 
select src.usrpriv_id, src.usrpriv_priv_id, src.usrpriv_username
from usrpriv src
  join priv on priv_id=usrpriv_priv_id
where not exists (
  select chk.userpriv_id
  from xt.userpriv chk
  where chk.userpriv_id=src.usrpriv_id
);
