create or replace function xt.co_line_tax(coitem) returns numeric stable as $$
  select round(coalesce(sum(tax),0),6)
  from (
    select (calculatetaxdetail(
      cohead_taxzone_id, 
      $1.coitem_taxtype_id,
      cohead_orderdate,
      cohead_curr_id,
      xt.co_line_extended_price($1))).taxdetail_tax as tax
    from cohead
    where cohead_id = $1.coitem_cohead_id) data;
$$ language sql;
