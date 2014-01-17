create or replace function xt.po_total(pohead) returns numeric stable as $$
  select xt.po_subtotal($1) + xt.po_freight_subtotal($1) + xt.po_tax_total($1) + $1.pohead_freight;
$$ language sql;
