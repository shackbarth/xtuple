create or replace function xt.invc_subtotal(invchead) returns numeric stable as $$
  select coalesce(sum(xt.invc_line_extended_price(invcitem)),0)
  from invcitem
  where (invcitem_invchead_id=$1.invchead_id);
$$ language sql;
