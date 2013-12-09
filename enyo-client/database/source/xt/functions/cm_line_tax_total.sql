create or replace function xt.cmitem_tax_total(cmitem_id integer) returns numeric stable as $$
  select sum(taxhist_tax) as tax_total
  from cmitemtax
  where taxhist_parent_id=$1;
$$ language sql;
