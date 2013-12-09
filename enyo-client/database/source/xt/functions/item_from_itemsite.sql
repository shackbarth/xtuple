create or replace function xt.item_from_itemsite(itemsite_id integer) returns integer stable as $$
  select itemsite_item_id
  from itemsite
  where itemsite_id = $1
$$ language sql;
