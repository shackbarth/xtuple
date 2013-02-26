create or replace function xt.quote_total(integer) returns numeric stable as $$
  select xt.quote_subtotal(quhead_id) + xt.quote_tax_total(quhead_id) + quhead_freight + quhead_misc
  from quhead
  where quhead_id=$1;
$$ language sql