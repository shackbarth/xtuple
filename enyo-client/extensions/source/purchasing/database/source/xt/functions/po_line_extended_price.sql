create or replace function xt.po_line_extended_price(poitem) returns numeric stable as $$
  select round($1.poitem_qty_ordered * $1.poitem_unitprice,2);
$$ language sql;
