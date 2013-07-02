create or replace function xt.co_subtotal(cohead) returns numeric stable as $$
  select coalesce(sum(xt.co_line_extended_price(coitem)),0)
  from coitem
  where (coitem_cohead_id=$1.cohead_id);
$$ language sql;
