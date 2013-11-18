create or replace function xt.invc_tax_total(invchead_id integer) returns numeric stable as $$
  -- Note: the two levels of summing look redundant, but are actually necessary.
  -- Need to sum and round by tax group first, then sum the results of that. Otherwise
  -- the rounding will be wrong
  select coalesce(sum(tax),0.0)
  from (
    select round(sum(taxhist_tax),2) as tax 
    from invcitemtax
    inner join invcitem on taxhist_parent_id = invcitem_id
    where invcitem_invchead_id = $1
    group by taxhist_tax_id) as data;
$$ language sql;
