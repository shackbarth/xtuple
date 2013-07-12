select xt.create_view('xt.shipmentline', $$

  select 
    shipitem_shiphead_id as shiphead_id,
    coitem.obj_uuid as obj_uuid,
    coalesce(sum(shipitem_qty)) as at_shipping
  from coitem
    left join shipitem on shipitem_orderitem_id=coitem_id
  group by shipitem_shiphead_id,
    coitem.obj_uuid; 

$$, true);