--drop view xt.gl

create or replace view xt.gl as

select
  gltrans_id as gl_id,
  gltrans_date as gl_date,
  gltrans_notes as gl_notes,
  gltrans_accnt_id as gl_accnt_id,
  case when gltrans_amount < 0 then 'D' else 'C' end as gl_sense,
  abs(gltrans_amount) as gl_amount,
  gltrans_journalnumber as gl_journalnumber,
  gltrans_username as gl_username,
  gltrans_deleted as gl_deleted
from gltrans
order by gl_accnt_id, gl_date, gl_sense, gl_journalnumber;

create or replace rule "_INSERT" as on insert to xt.gl do instead nothing;

create or replace rule "_UPDATE" as on update to xt.gl do instead nothing;

create or replace rule "_DELETE" as on delete to xt.gl do instead nothing;