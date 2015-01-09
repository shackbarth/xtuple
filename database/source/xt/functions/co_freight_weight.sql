create or replace function xt.co_freight_weight(cohead) returns numeric stable as $$
  select round(coalesce(coitem_qtyord * coitem_qty_invuomratio * (item_prodweight + item_packweight), 0), 2)
  from coitem
    join itemsite on coitem_itemsite_id=itemsite_id
    join item on item_id=itemsite_item_id
  where coitem_cohead_id=$1.cohead_id;
$$ language sql;
