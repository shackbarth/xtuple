select xt.create_view('xt.womatlissue', $$

  select 
    *,
    current_date AS transdate,
    itemsite_qtyonhand AS qoh_before,
    null AS to_issue,
    womatl.obj_uuid
  from womatl
    join itemsite on itemsite_id=womatl_itemsite_id
    join item on itemsite_item_id=item_id
    join wo on wo_id=womatl_wo_id
  order by item_number

$$);