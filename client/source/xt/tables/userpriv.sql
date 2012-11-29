
insert into xt.userpriv 
select src.*
from usrpriv src
  join priv on priv_id=usrpriv_priv_id
where not exists (
  select chk.userpriv_id
  from xt.userpriv chk
  where chk.userpriv_id=src.usrpriv_id
);
