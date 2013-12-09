create or replace function xt.cm_total(cmhead) returns numeric stable as $$
  select xt.cm_subtotal($1.cmhead_id) + xt.cm_tax_total($1.cmhead_id) + $1.cmhead_freight + $1.cmhead_misc;
$$ language sql;
