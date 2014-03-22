create or replace function xt.cm_total(cmhead_id integer, cmhead_freight numeric, cmhead_misc numeric) returns numeric stable as $$
  select xt.cm_subtotal($1) + xt.cm_tax_total($1) + COALESCE($2, 0.0) + COALESCE($3, 0.0);
$$ language sql;
