create or replace function xt.po_line_tax(poitem) returns numeric stable as $$
  select round(coalesce(sum(tax),0),6)
  from (
    select (calculatetaxdetail(
      pohead_taxzone_id, 
      $1.poitem_taxtype_id,
      pohead_orderdate,
      pohead_curr_id,
      xt.po_line_extended_price($1))).taxdetail_tax as tax
    from pohead
    where pohead_id = $1.poitem_pohead_id) data;
$$ language sql;
