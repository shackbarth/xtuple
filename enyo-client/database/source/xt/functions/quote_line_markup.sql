create or replace function xt.quote_line_markup(quitem) returns numeric stable as $$
  select
    case
      when $1.quitem_unitcost = 0 then null
      when fetchmetricbool('Long30Markups') then
        round((1.0 - (currtobase(quhead_curr_id, $1.quitem_price, quhead_quotedate) / $1.quitem_unitcost)), 6)
      else round(((currtobase(quhead_curr_id, $1.quitem_price, quhead_quotedate) / $1.quitem_unitcost) - 1.0), 6)
    end
  from item, quhead
  where item_id=$1.quitem_item_id
   and quhead_id=$1.quitem_quhead_id;
$$ language sql;
