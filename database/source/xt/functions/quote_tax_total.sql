create or replace function xt.quote_tax_total(quhead) returns numeric stable as $$
  -- Note: the two levels of summing look redundant, but are actually necessary.
  -- Need to sum and round by tax group first, then sum the results of that. Otherwise
  -- the rounding will be wrong
  select coalesce(sum(tax),0.0)
  from (
    select round(sum(taxdetail_tax),2) as tax 
    from calculateTaxDetailSummary('Q', $1.quhead_id, 'T')
    group by taxdetail_tax_id) as data;
$$ language sql;