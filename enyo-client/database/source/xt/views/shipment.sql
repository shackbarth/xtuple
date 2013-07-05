select xt.create_view('xt.shipment', $$

	SELECT *,
		cohead_cust_id AS cust_id,
		cohead_shipto_id AS shipto_id
	FROM shiphead, cohead	
	WHERE ((shiphead_order_type='SO')
		AND (shiphead_order_id = cohead_id)); 

$$, false);

create or replace rule "_INSERT" as on insert to xt.shipment do instead 

insert into shiphead (
  shiphead_id,
  shiphead_order_id,
  shiphead_order_type,
  shiphead_number,
  shiphead_shipvia,
  shiphead_freight,
  shiphead_freight_curr_id,
  shiphead_notes,
  shiphead_shipped,
  shiphead_shipdate,
  shiphead_shipchrg_id,
  shiphead_shipform_id,
  shiphead_sfstatus,
  shiphead_tracknum) 
values (
  new.shiphead_id,
  new.shiphead_order_id,
  new.shiphead_order_type,
  new.shiphead_number,
  new.shiphead_shipvia,
  new.shiphead_freight,
  new.shiphead_freight_curr_id,
  new.shiphead_notes,
  new.shiphead_shipped,
  new.shiphead_shipdate,
  new.shiphead_shipchrg_id,
  new.shiphead_shipform_id,
  new.shiphead_sfstatus,
  new.shiphead_tracknum);

create or replace rule "_UPDATE" as on update to xt.shipment do instead

update shiphead set
  shiphead_order_id = new.shiphead_order_id,
  shiphead_order_type = new.shiphead_order_type,
  shiphead_number = new.shiphead_number,
  shiphead_shipvia = new.shiphead_shipvia,
  shiphead_freight = new.shiphead_freight,
  shiphead_freight_curr_id = new.shiphead_freight_curr_id,
  shiphead_notes = new.shiphead_notes,
  shiphead_shipped = new.shiphead_shipped,
  shiphead_shipdate = new.shiphead_shipdate,
  shiphead_shipchrg_id = new.shiphead_shipchrg_id,
  shiphead_shipform_id = new.shiphead_shipform_id,
  shiphead_sfstatus = new.shiphead_sfstatus,
  shiphead_tracknum = new.shiphead_tracknum
where shiphead_id = old.shiphead_id;

create or replace rule "_DELETE" as on delete to xt.shipment do instead

delete from shiphead where shiphead.shiphead_id = old.shiphead_id;
