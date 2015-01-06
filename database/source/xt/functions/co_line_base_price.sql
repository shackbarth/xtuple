create or replace function xt.co_line_base_price(coitem) returns numeric stable as $$
  select round($1.coitem_price - (
    select sum(charass_price)
    from charass
    where charass_target_type='SI'
      and charass_target_id=$1.coitem_id),4);
$$ language sql;
