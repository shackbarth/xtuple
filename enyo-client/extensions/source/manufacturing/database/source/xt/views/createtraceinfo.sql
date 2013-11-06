select xt.create_view('xt.createtraceinfo', $$

  select   
    null::integer as itemsite_id,
    null::numeric as quantity,
    null::text as ls_number,
    null::text as location,
    null::date as expire_date,
    null::date as warranty_date,
    null::text as characteristic,
    0::numeric as distributed
  ;

create or replace rule "_INSERT" as on insert to xt.createtraceinfo do instead nothing;

create or replace rule "_UPDATE" as on update to xt.createtraceinfo do instead nothing;

create or replace rule "_DELETE" as on delete to xt.createtraceinfo do instead nothing;

$$, false);