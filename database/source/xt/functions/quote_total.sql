create or replace function xt.quote_total(quhead) returns numeric stable as $$
  select xt.quote_subtotal($1) + xt.quote_tax_total($1) + $1.quhead_freight + $1.quhead_misc;
$$ language sql;