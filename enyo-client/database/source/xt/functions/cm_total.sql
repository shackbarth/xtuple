create or replace function xt.cm_total(cmhead_id integer, cmhead_freight numeric, cmhead_misc numeric) returns numeric stable as $$
  select xt.cm_subtotal($1) + xt.cm_tax_total($1) + $2 + $3;
$$ language sql;
