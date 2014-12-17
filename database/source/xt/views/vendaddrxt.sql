select xt.create_view('xt.vendaddrxt', $$

select
  vend_id as id,
  vendinfo.obj_uuid as uuid,
  vend_id,
  'Main' as code,
  vend_name as name,
  vend_addr_id as addr_id,
  vend_cntct1_id as cntct_id,
  0 as orderby
from vendinfo
union all
select
  vendaddr_id as id,
  vendaddrinfo.obj_uuid as uuid,
  vendaddr_vend_id as vend_id,
  vendaddr_code as code,
  vendaddr_name as name,
  vendaddr_addr_id as addr_id,
  vendaddr_cntct_id as cntct_id,
  1 as orderby
from vendaddrinfo
order by orderby, code;

$$);
