create or replace function xt.ar_tax_total(aropen_id integer) returns numeric stable as $$
  select coalesce(sum(taxhist_tax),0)
  from aropentax
  where (taxhist_parent_id = $1);
$$ language sql;