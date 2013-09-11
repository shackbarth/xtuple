select xt.create_view('xt.coitemship', $$

  select 
    coitem_id,
    coitem.obj_uuid,
    coitem_cohead_id,
    coitem_linenumber,
    coitem_subnumber,
    coitem_itemsite_id,
    coitem_scheddate,
    coitem_qty_uom_id,
    coitem_qtyord,
    coitem_qtyshipped,
    coitem_qtyreturned,
    ship_balance,
    at_shipping,
    null as to_issue,
    shiphead_id
  from xt.coiteminfo as coitem
    join itemsite on itemsite_id=coitem_itemsite_id
    join item on itemsite_item_id=item_id
    join cohead on cohead_id=coitem_cohead_id
    left join shiphead on cohead_id=shiphead_order_id and shiphead_order_type='SO' and not shiphead_shipped
  where coitem_status='O'
    and item_type != 'K'
    and coitem_qtyord - coitem_qtyshipped + coitem_qtyreturned > 0
  order by coitem_linenumber, coitem_subnumber

$$);