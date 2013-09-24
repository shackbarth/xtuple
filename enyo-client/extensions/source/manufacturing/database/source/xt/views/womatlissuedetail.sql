select xt.create_view('xt.womatlissuedetail', $$

  select 
    womatlpost_id as issued_materials,
    womatl_id as order_line,
    case when invdetail_location_id = -1 then null else invdetail_location_id end as location,
    invdetail_ls_id as trace,
    invdetail_qty * -1 as quantity,
    invhist_invuom as unit
  from invdetail
    join invhist on invdetail_invhist_id=invhist_id
    join womatlpost on invhist_id=womatlpost_invhist_id
    join womatl on womatlpost_womatl_id = womatl_id
    join wo on womatl_wo_id=wo_id

$$, true);
