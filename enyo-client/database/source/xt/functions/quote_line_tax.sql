create or replace function xt.quote_line_tax(quitem) returns numeric stable as $$
  select round(coalesce(sum(tax),0),6)
  from (
    select (calculatetaxdetail(
      quhead_taxzone_id, 
      $1.quitem_taxtype_id,
      quhead_quotedate,
      quhead_curr_id,
      xt.quote_line_extended_price($1))).taxdetail_tax as tax
    from quhead
    where quhead_id = $1.quitem_quhead_id) data;
$$ language sql;