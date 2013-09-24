select xt.create_view('xt.womatlissue', $$

  select 
    womatl.*,
    itemsite_qtyonhand AS qoh_before,
    null::numeric AS to_issue
  from womatl
    join itemsite on itemsite_id=womatl_itemsite_id
    join item on itemsite_item_id=item_id
    join wo on wo_id=womatl_wo_id
  order by item_number

$$);