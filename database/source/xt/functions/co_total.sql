create or replace function xt.co_total(cohead) returns numeric stable as $$
  select xt.co_subtotal($1) + xt.co_tax_total($1) + $1.cohead_freight + $1.cohead_misc;
$$ language sql;
