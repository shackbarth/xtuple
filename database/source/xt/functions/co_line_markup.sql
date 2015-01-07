create or replace function xt.co_line_markup(coitem) returns numeric stable as $$
  select
    case
      when $1.coitem_unitcost = 0 then null
      when fetchmetricbool('Long30Markups') then
        round((1.0 - (currtobase(cohead_curr_id, $1.coitem_price, cohead_orderdate) / $1.coitem_unitcost)), 6)
      else round(((currtobase(cohead_curr_id, $1.coitem_price, cohead_orderdate) / $1.coitem_unitcost) - 1.0), 6)
    end
  from item, itemsite, cohead
  where item_id = itemsite_item_id
   and itemsite_id=$1.coitem_itemsite_id
   and cohead_id=$1.coitem_cohead_id;

$$ language sql;
