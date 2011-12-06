create or replace function xm.address_find_existing(line1 text, line2 text, line3 text, city text, state text, postalcode text, country text) 
  returns integer stable as $$
-- Copyright (c) 1999-2011 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xm.ple.com/CPAL for the full text of the software license.
  select coalesce( (
    select addr_id
    from addr 
    where ((coalesce(upper(addr_line1),'') = coalesce(upper($1),''))
     and (coalesce(upper(addr_line2),'') = coalesce(upper($2),''))
     and (coalesce(upper(addr_line3),'') = coalesce(upper($3),''))
     and (coalesce(upper(addr_city),'') = coalesce(upper($4),''))
     and (coalesce(upper(addr_state),'') = coalesce(upper($5),''))
     and (coalesce(upper(addr_postalcode),'') = coalesce(upper($6),''))
     and (coalesce(upper(addr_country),'') = coalesce(upper($7),'')))
    limit 1
    ), 0);
$$ LANGUAGE 'sql';
