select xt.create_view('xt.coitemship', $$

  select 
    coitem_id,
    obj_uuid,
    coitem_cohead_id,
    formatsolinenumber(coitem_id) as linenumber,
    coitem_item_id, 
    coitem_warehous_id,
    coitem_scheddate,
    coitem_qty_uom_id,
    coitem_qtyord,
    coitem_qtyshipped,
    coitem_qtyreturned,
    ship_balance,
    at_shipping,
    null as to_issue
  from xt.coiteminfo
  where coitem_status='O' 
  order by coitem_linenumber, coitem_subnumber

$$, true);