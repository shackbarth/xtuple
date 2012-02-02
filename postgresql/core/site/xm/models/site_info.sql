select private.create_model(

-- Model name, schema, table

'site_info', 'public', 'whsinfo',

-- Columns

E'{
  "whsinfo.warehous_id as guid",
  "whsinfo.warehous_code as code",
  "whsinfo.warehous_active as is_active",
  "whsinfo.warehous_descrip as description",
  "whsinfo.warehous_sitetype_id as site_type",
  "whsinfo.warehous_addr_id as address"
}',

-- sequence

'',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.site_info
  do instead nothing;

","
  
-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.site_info
  do instead nothing;

","
  
-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.site_info   
  do instead nothing;

"}',

-- Conditions, Comment, System

'{}', 'Site Info Model', true, true);
