select xt.create_view('xt.shipheadinfo', $$

  select *, current_date as trans_date
   from shiphead; 

$$, false);


create or replace rule "_INSERT" as on insert to xt.shipheadinfo do instead

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
  shiphead_tracknum
) values (
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
  new.shiphead_tracknum
);

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

create or replace rule "_DELETE" as on delete to xt.shipheadinfo do instead

delete from shiphead where shiphead_id=OLD.shiphead_id;