create or replace function xt.quote_tax_total(integer) returns numeric stable as $$
  select coalesce(sum(tax),0.0)
  from (
    select round (sum(taxdetail_tax),2) as tax 
    from tax 
     join calculateTaxDetailSummary('Q', $1, 'T') ON (taxdetail_tax_id=tax_id)
    group by tax_id) as data;
$$ language sql