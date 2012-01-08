select private.create_model(

-- Model name, schema

'user_account_info', '', 

-- table

E'(select 
     usr_username as username,
     usr_active as is_active,
     usr_propername as propername
   from public.usr
   union all
   select
     user_username as username,
     user_active as is_active,
     user_propername as propername
   from private.user) usr',

-- Columns

E'{
  "usr.username",
  "usr.is_active",
  "usr.propername"}',
     
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

'{}', 'User Account Info Model', true);