create or replace function xt.invc_total(invchead) returns numeric stable as $$
  select xt.invc_subtotal($1) + xt.invc_tax_total($1.invchead_id) + $1.invchead_freight + $1.invchead_misc_amount;
$$ language sql;
