create or replace function xt.cm_subtotal(cmhead_id integer) returns numeric stable as $$
  select coalesce(sum(xt.invc_line_extended_price(cmitem_qtycredit, cmitem_qty_invuomratio,
    cmitem_unitprice, cmitem_price_invuomratio)),0)
  from cmitem
  where (cmitem_cmhead_id=$1);
$$ language sql;
