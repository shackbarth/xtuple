create or replace function xt.po_tax_total(pohead) returns numeric stable as $$
  select coalesce(sum(tax),0) as tax
  from (
    select round(sum(taxdetail_tax),2) as tax
    from tax
    join calculatetaxdetailsummary('PO', $1.pohead_id, 'T') on (taxdetail_tax_id=tax_id)
    group by tax_id) as data;
$$ language sql;
