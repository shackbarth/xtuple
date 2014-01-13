create or replace function xt.cm_tax_total(cmhead_id integer) returns numeric stable as $$
  -- Note: the two levels of summing look redundant, but are actually necessary.
  -- Need to sum and round by tax group first, then sum the results of that. Otherwise
  -- the rounding will be wrong
  select coalesce(sum(tax),0.0)
  from (
    select -1 * round(sum(taxhist_tax),2) as tax 
    from cmitemtax
    inner join cmitem on taxhist_parent_id = cmitem_id
    where cmitem_cmhead_id = $1
    group by taxhist_tax_id) as data;
$$ language sql;
