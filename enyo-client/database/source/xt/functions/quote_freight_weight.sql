create or replace function xt.quote_freight_weight(quhead) returns numeric stable as $$
  select round(coalesce(quitem_qtyord * quitem_qty_invuomratio * (item_prodweight + item_packweight), 0), 2)
  from quitem
    join itemsite on quitem_itemsite_id=itemsite_id
    join item on item_id=itemsite_item_id
  where quitem_quhead_id=$1.quhead_id;
$$ language sql;