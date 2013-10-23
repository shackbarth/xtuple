select xt.create_view('xt.createtraceinfo', $$

  select   
    itemsite_id,
    null::numeric as quantity,
    null::text as ls_number,
    null::text as location,
    null::date as expire_date,
    null::date as warranty_date,
    null::text as characteristic
  from itemsite
  ;

$$, false);