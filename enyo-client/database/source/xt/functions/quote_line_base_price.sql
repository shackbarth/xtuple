create or replace function xt.quote_line_base_price(quitem) returns numeric stable as $$
  select round($1.quitem_price - (
    select sum(charass_price)
    from charass
    where charass_target_type='QI'
      and charass_target_id=$1.quitem_id),4);
$$ language sql;