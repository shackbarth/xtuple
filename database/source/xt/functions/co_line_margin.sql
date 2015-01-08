create or replace function xt.co_line_margin(coitem) returns numeric stable as $$
  select round(xt.co_line_extended_price($1) - (
    currtocurr(basecurrid(), cohead_curr_id, $1.coitem_unitcost, cohead_orderdate) * 
    $1.coitem_qtyord  * $1.coitem_qty_invuomratio / $1.coitem_price_invuomratio), 2)
  from cohead where cohead_id = $1.coitem_cohead_id;
$$ language sql;
