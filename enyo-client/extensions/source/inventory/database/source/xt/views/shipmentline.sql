select xt.create_view('xt.shipmentline', $$

  select 
    shiphead_id,
    coitem.obj_uuid as obj_uuid,
    sum(shipitem_qty) as issued,
    array(
      select shipmentdetail
      from xt.shipmentdetail
      where shipitem_orderitem_id=shipmentdetail.order_line)
   from shiphead
    join shipitem on shipitem_shiphead_id=shiphead_id
    join coitem on shipitem_orderitem_id=coitem_id
   group by shiphead_id,
     shipitem_orderitem_id,
     coitem.obj_uuid; 

$$, false);

-- remove old trigger if any
drop trigger if exists shipmentline_did_change on xt.shipmentline;

-- create trigger
create trigger shipmentline_did_change instead of update on xt.shipmentline for each row execute procedure xt.shipmentline_did_change();


