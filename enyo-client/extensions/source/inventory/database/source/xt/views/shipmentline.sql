select xt.create_view('xt.shipmentline', $$

  select 
    shiphead_id,
    coitem.obj_uuid as obj_uuid,
    sum(shipitem_qty) as at_shipping,
    null as to_issue,
    false as return
   from shiphead
    join shipitem on shipitem_shiphead_id=shiphead_id
    join coitem on shipitem_orderitem_id=coitem_id
   group by shiphead_id,
     coitem.obj_uuid; 

$$, true);
