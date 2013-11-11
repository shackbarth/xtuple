create or replace function xt.ar_tax_total(aropen) returns numeric stable as $$
  select coalesce(sum(taxhist_amount),0)
  from aropentax
  where (taxhist_parent_id=$1.aropen_id);
$$ language sql;