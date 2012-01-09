select private.create_model(

-- Model name, schema, table

'account_info', 'public', 'crmacct',

-- Columns

E'{
  "crmacct.crmacct_id as guid",
  "crmacct.crmacct_number as \\"number\\"",
  "crmacct.crmacct_name as \\"name\\"",
  "crmacct.crmacct_active as is_active"}',

-- Rules

E'{"
-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.account_info 
  do instead nothing;

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.account_info
  do instead nothing;

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.account_info   
  do instead nothing;

"}', 

-- Conditions, Comment, System
'{}', 'Account Info Model', true);
