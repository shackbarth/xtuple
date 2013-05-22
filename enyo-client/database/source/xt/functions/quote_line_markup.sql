create or replace function xt.quote_line_markup(quitem) returns numeric stable as $$
  select
    case
      when $1.quitem_custprice = 0 then null
      else round(1.0 - (currtobase(quhead_curr_id, $1.quitem_price, quhead_quotedate) / item_listprice),6)
    end
  from item, quhead
  where item_id=$1.quitem_item_id
   and quhead_id=$1.quitem_quhead_id;
$$ language sql
