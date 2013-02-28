create or replace function xt.quote_line_tax(integer) returns numeric stable as $$
  select coalesce(sum(tax),0)
  from (
    select (calculatetaxdetail(
      quhead_taxzone_id, 
      quitem_taxtype_id,
      quhead_quotedate,
      quhead_curr_id,
      xt.quote_line_extended_price(quitem_id))).taxdetail_tax as tax
    from quitem
      join quhead on quhead_id = quitem_quhead_id
    where quitem_id=$1) data;
$$ language sql