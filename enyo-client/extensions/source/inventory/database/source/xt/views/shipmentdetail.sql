select xt.create_view('xt.shipmentdetail', $$

  select 
    shiphead_id as shipment,
    coitem_id as order_line,
    case when invdetail_location_id = -1 then null else invdetail_location_id end as location,
    invdetail_ls_id as trace,
    invdetail_qty * -1 as quantity,
    invhist_invuom as unit
   from invdetail
    join invhist on invdetail_invhist_id=invhist_id
    join shipitem on invhist_id=shipitem_invhist_id
    join coitem on shipitem_orderitem_id=coitem_id
    join shiphead on shiphead_id=shipitem_shiphead_id

$$, true);
