select private.create_model(

-- Model name, schema, table

'contact_info', 'public', 'cntct',

-- Columns

E'{
  "cntct.cntct_id as guid",
  "cntct.cntct_name as name",
  "cntct.cntct_active as is_active",
  "cntct.cntct_title as job_title",
  "cntct.cntct_phone as phone",
  "cntct.cntct_phone2 as alternate",
  "cntct.cntct_fax as fax",
  "cntct.cntct_email as primary_email",
  "cntct.cntct_webaddr as web_address",
  "(select address_info 
    from xm.address_info
    where guid = cntct.cntct_addr_id) as address"}',
     
-- sequence

'',

-- Rules

E'{"
-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.contact_info 
  do instead nothing;

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.contact_info
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.contact_info   
  do instead nothing;

"}', 

-- Conditions, Comment, System, Nested
'{}', 'Contact Info Model', true, true);