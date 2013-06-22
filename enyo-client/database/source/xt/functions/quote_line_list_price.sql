create or replace function xt.quote_line_list_price(quitem) returns numeric stable as $$
  select round(item_listprice * ($1.quitem_price_invuomratio / iteminvpricerat(item_id)),4)
  from item
  where item_id=$1.quitem_item_id;
$$ language sql;