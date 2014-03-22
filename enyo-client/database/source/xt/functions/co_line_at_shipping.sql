create or replace function xt.co_line_at_shipping(coitem) returns numeric stable as $$
  select round(coalesce(sum(shipitem_qty),0), 6)
  from shipitem
    join shiphead on shiphead_id=shipitem_shiphead_id
  where shipitem_orderitem_id=$1.coitem_id
    and shiphead_order_type='SO'
    and not shiphead_shipped;
$$ language sql;
