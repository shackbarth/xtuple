select xt.create_view('xt.invdist', $$

  select 
    null::integer as invdist_id,
    null::text as obj_uuid,
    null::integer as invdist_parent_id,
    null::numeric as invdist_qty,
    null::integer as invdist_location_id,
    null::integer as invdist_ls_id

$$);