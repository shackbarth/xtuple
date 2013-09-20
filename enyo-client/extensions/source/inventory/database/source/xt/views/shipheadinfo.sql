select xt.create_view('xt.shipheadinfo', $$

  select distinct shiphead.*,
    case when invchead_id is not null then true else false end as invoiced, 
    coalesce(invchead_posted, false) as invchead_posted,
    xt.shipment_value(shiphead) as shipment_value
  from shiphead
    left join shipitem on shiphead_id=shipitem_shiphead_id
    left join invcitem on (invcitem_id=shipitem_invcitem_id)
    left join invchead on (invchead_id=invcitem_invchead_id); 

$$, false);


create or replace rule "_INSERT" as on insert to xt.shipheadinfo do instead nothing;

create or replace rule "_UPDATE" as on update to xt.shipheadinfo do instead

update shiphead set
  shiphead_order_id=new.shiphead_order_id,
  shiphead_order_type=new.shiphead_order_type,
  shiphead_number=new.shiphead_number,
  shiphead_shipvia=new.shiphead_shipvia,
  shiphead_freight=new.shiphead_freight,
  shiphead_freight_curr_id=new.shiphead_freight_curr_id,
  shiphead_notes=new.shiphead_notes,
  shiphead_shipped=new.shiphead_shipped,
  shiphead_shipdate=new.shiphead_shipdate,
  shiphead_shipchrg_id=new.shiphead_shipchrg_id,
  shiphead_shipform_id=new.shiphead_shipform_id,
  shiphead_sfstatus=new.shiphead_sfstatus,
  shiphead_tracknum=new.shiphead_tracknum
where shiphead_id = old.shiphead_id;

create or replace rule "_DELETE" as on delete to xt.shipheadinfo do instead nothing;