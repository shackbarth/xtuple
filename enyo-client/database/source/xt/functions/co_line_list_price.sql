create or replace function xt.co_line_list_price(coitem) returns numeric stable as $$
  select round(item_listprice * ($1.coitem_price_invuomratio / iteminvpricerat(item_id)),4)
  from itemsite
  inner join item on itemsite_item_id = item_id
  where itemsite_id=$1.coitem_itemsite_id;
$$ language sql;
