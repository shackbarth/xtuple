select xt.create_view('xt.womatlissue', $$

  select 
    womatl.*,
    item_id AS womatl_item_id,
    itemsite_warehous_id AS womatl_warehous_id,
    itemsite_qtyonhand AS qoh_before,
    case when (womatl_qtyiss > womatl_qtyreq) then 0 else (womatl_qtyreq - womatl_qtyiss) end AS balance,
    null::numeric AS to_issue
  from womatl
    join itemsite on itemsite_id=womatl_itemsite_id
    join item on itemsite_item_id=item_id
    join wo on wo_id=womatl_wo_id
  where coalesce(womatl_status, '') != 'C' 
  	AND wo_status != 'C' 
  	AND item_type != 'K'
  order by item_number

$$);