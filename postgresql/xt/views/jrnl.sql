drop view if exists xt.jrnl cascade;

create or replace view xt.jrnl as

select
  sltrans_id as jrnl_id,
  case 
    when sltrans_source = 'G/L' then 'G'
    when sltrans_doctype = 'CR' then 'CR'
    when sltrans_doctype = 'CK' then 'CD'
    when sltrans_source = 'A/P' then 'P'
    when sltrans_source = 'A/R' then 'S'
    when sltrans_source in ('I/M','S/R','P/D', 'W/O') then 'I'
    else 'ERR'
  end as jrnl_type,
  sltrans_date as jrnl_date,
  sltrans_sequence as jrnl_sequence,
  sltrans_accnt_id as jrnl_accnt_id,
  sltrans_source as jrnl_source,
  sltrans_doctype as jrnl_doctype,
  sltrans_docnumber as jrnl_docnumber,
  sltrans_misc_id as jrnl_misc_id,
  case when sltrans_amount < 0 then 'D' else 'C' end as jrnl_sense,
  abs(sltrans_amount) as jrnl_amount,
  sltrans_notes as jrnl_notes,
  sltrans_gltrans_journalnumber as jrnl_number,
  sltrans_created as jrnl_created,
  sltrans_username as jrnl_username,
  sltrans_rec as jrnl_rec
from sltrans
where sltrans_source in ('G/L','A/R','A/P','W/O','P/D','I/M','S/R')
union all
select
  gltrans_id as jrnl_id,
  case 
    when gltrans_source = 'G/L' then 'G'
    when gltrans_doctype = 'CR' then 'CR'
    when gltrans_doctype = 'CK' then 'CD'
    when gltrans_source = 'A/P' then 'P'
    when gltrans_source = 'A/R' then 'S'
    when gltrans_source in ('I/M','S/R','P/D') then 'I'
    when gltrans_source = 'W/O' then 'M'
    else 'ERR'
  end as jrnl_type,
  gltrans_date as jrnl_date,
  gltrans_sequence as jrnl_sequence,
  gltrans_accnt_id as jrnl_accnt_id,
  gltrans_source as jrnl_source,
  gltrans_doctype as jrnl_doctype,
  gltrans_docnumber as jrnl_docnumber,
  gltrans_misc_id as jrnl_misc_id,
  case when gltrans_amount < 0 then 'D' else 'C' end as jrnl_sense,
  abs(gltrans_amount) as jrnl_amount,
  gltrans_notes as jrnl_notes,
  gltrans_journalnumber as jrnl_number,
  gltrans_created as jrnl_created,
  gltrans_username as jrnl_username,
  gltrans_rec as jrnl_rec
from gltrans
where gltrans_source in ('G/L','A/R','A/P','W/O','P/D','I/M','S/R')
 and gltrans_doctype != 'JP'
order by jrnl_date, jrnl_sequence, jrnl_sense desc;

grant all on table xt.jrnl to xtrole;

create or replace rule "_INSERT" as on insert to xt.jrnl do instead nothing;

create or replace rule "_UPDATE" as on update to xt.jrnl do instead nothing;

create or replace rule "_DELETE" as on delete to xt.jrnl do instead nothing;
