select xt.create_view('xt.shipmentline', $$

	select 
    shipitem_orderitem_id,
    shipitem_shiphead_id,
    SUM(shipitem_qty) as shipitem_qty,
    shipitem_shipped,
    shipitem_shipdate,
    max(shipitem_transdate) as shipitem_lasttransdate,
    shipitem_invoiced,
    shipitem_invcitem_id,
    shipitem_value
	from shipitem, shiphead	
	where ((shiphead_order_type='SO')
		and (shipitem_shiphead_id = shiphead_id))
	group by shipitem_orderitem_id, shipitem_shiphead_id, shipitem_shipped, shipitem_shipdate, shipitem_invoiced, shipitem_invcitem_id, shipitem_value; 

$$, false);

-- remove old trigger if any
drop trigger if exists shipmentline_did_change on xt.shipmentline;

-- create trigger
create trigger shipmentline_did_change instead of update on xt.shipmentline for each row execute procedure xt.shipmentline_did_change();


