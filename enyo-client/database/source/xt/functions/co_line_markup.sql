create or replace function xt.co_line_markup(coitem) returns numeric stable as $$
  select
    case
      when $1.coitem_custprice = 0 then null
      else round(1.0 - (currtobase(cohead_curr_id, $1.coitem_price, cohead_orderdate) / item_listprice),6)
    end
  from item, itemsite, cohead
  where item_id = itemsite_item_id
   and itemsite_id=$1.coitem_itemsite_id
   and cohead_id=$1.coitem_cohead_id;

$$ language sql
