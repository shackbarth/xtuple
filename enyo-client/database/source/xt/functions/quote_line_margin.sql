create or replace function xt.quote_line_margin(quitem) returns numeric stable as $$
  select round(xt.quote_line_extended_price($1) - (
    currtocurr(basecurrid(), quhead_curr_id, $1.quitem_unitcost, quhead_quotedate) * 
    $1.quitem_qtyord  * $1.quitem_qty_invuomratio / $1.quitem_price_invuomratio), 2)
  from quhead where quhead_id = $1.quitem_quhead_id;
$$ language sql;
