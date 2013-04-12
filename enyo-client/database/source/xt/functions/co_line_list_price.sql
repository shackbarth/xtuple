create or replace function xt.co_line_list_price(coitem) returns numeric stable as $$
  select round(item_listprice * ($1.coitem_price_invuomratio / iteminvpricerat(item_id)),4)
  from item
  where item_id=$1.coitem_item_id;
$$ language sql
