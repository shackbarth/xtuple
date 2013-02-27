create or replace function xt.quote_subtotal(integer) returns numeric stable as $$
<<<<<<< Updated upstream
  select coalesce(sum(tax),0.0)
  from (
    select round (sum(taxdetail_tax),2) as tax 
    from tax 
     join calculateTaxDetailSummary('Q', $1, 'T') ON (taxdetail_tax_id=tax_id)
    group by tax_id) as data;
=======
  select coalesce(sum(xt.quote_line_extended_price(quitem_id)),0)
  from quitem
  where (quitem_quhead_id=$1);
>>>>>>> Stashed changes
$$ language sql