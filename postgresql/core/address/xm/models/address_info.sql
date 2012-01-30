select private.create_model(

-- Model name, schema, table

'address_info', 'public', 'addr',

-- Columns

E'{
  "addr.addr_id as guid",
  "addr.addr_line1 as line1",
  "addr.addr_line2 as line2",
  "addr.addr_line3 as line3",
  "addr.addr_city as city",
  "addr.addr_state as state",
  "addr.addr_postalcode as postalcode",
  "addr.addr_country as country"}',
     
-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.address_info
  do instead nothing

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.address_info
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.address_info
  do instead nothing;

"}', 

-- Conditions, Comment, System

'{}', 'Address Info Model', true, true);
