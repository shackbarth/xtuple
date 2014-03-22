create or replace function xt.po_line_tax(poitem) returns numeric stable as $$
  select calculateTax(
    pohead_taxzone_id, 
    $1.poitem_taxtype_id,
    pohead_orderdate,pohead_curr_id,round(xt.po_line_extended_price($1),2)) AS tax
  from pohead
  where (pohead_id=$1.poitem_pohead_id)
$$ language sql;
