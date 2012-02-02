select private.create_model(

-- Model name, schema, table

'user_account_info', 'private', 'usr',

-- Columns

E'{
  "usr.usr_username as username",
  "usr.usr_active as is_active",
  "usr.usr_propername as propername"}',
     
-- sequence

'',

-- Rules

E'{"

-- insert rule

create or replace rule \\"_CREATE\\" as on insert to xm.user_account_info
  do instead nothing;

","

-- update rule

create or replace rule \\"_UPDATE\\" as on update to xm.user_account_info
  do instead nothing;

","

-- delete rule

create or replace rule \\"_DELETE\\" as on delete to xm.user_account_info
  do instead nothing;

"}', 

-- Conditions, Comment, System

'{}', 'User Account Info Model', true, true);