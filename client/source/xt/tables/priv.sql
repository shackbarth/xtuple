-- table definition

insert into xt.priv
select src.priv_id, src.priv_name, src.priv_descrip, '', '', 'xtuple'
from only public.priv src
where not exists (
  select chk.priv_id
  from xt.priv chk
  where chk.priv_id=src.priv_id
);