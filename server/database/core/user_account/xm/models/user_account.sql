select private.create_model(
-- Model name, schema, table

'user_account', 'private', 'usr',

-- Columns

E'{
  "usr.usr_username as guid",
  "usr.usr_username as username",
  "usr.usr_active as is_active",
  "usr.usr_propername as propername",
  "usr.usr_passwd as password",
  "usr.usr_initials as initials",
  "usr.usr_email as email",
  "usr.usr_locale_id as locale",
  "usr.usr_disable_export as disable_export",
  "usr.usr_can_create_users as can_create_users",
  "usr.usr_db_user as is_database_user",
  "array(
    select user_account_privilege_assignment
    from xm.user_account_privilege_assignment
    where (user_account = usr.usr_username)) as privileges",
  "array(
    select user_account_user_account_role_assignment
    from xm.user_account_user_account_role_assignment
    where (user_account = usr.usr_username)) as user_roles"}',
     
-- Rules

E'{"

-- insert rules

create or replace rule \\"_CREATE\\" as on insert to xm.user_account do instead

insert into private.usr (
  usr_username,
  usr_active,
  usr_propername,
  usr_initials,
  usr_passwd,
  usr_locale_id,
  usr_email,
  usr_disable_export,
  usr_can_create_users,
  usr_db_user )
values (
  new.username,
  new.is_active,
  new.propername,
  new.initials,
  new.password,
  new.locale,
  new.email,
  new.disable_export,
  new.can_create_users,
  new.is_database_user
);

","

create or replace rule \\"_CREATE_CHECK_PRIV\\" as on insert to xm.user_account 
   where not checkPrivilege(\'MaintainUsers\') do instead

  select private.raise_exception(\'You do not have privileges to create this User Account\');

","

-- update rules

create or replace rule \\"_UPDATE\\" as on update to xm.user_account do instead (

update private.usr set
  usr_active = new.is_active,
  usr_propername = new.propername,
  usr_passwd = new.password,
  usr_initials = new.initials,
  usr_email = new.email,
  usr_locale_id = new.locale,
  usr_can_create_users = new.can_create_users,
  usr_db_user = new.is_database_user
where ( usr_username = old.username );

);

","

create or replace rule \\"_UPDATE_CHECK_PRIV\\" as on update to xm.user_account 
   where not checkPrivilege(\'MaintainUsers\') do instead

  select private.raise_exception(\'You do not have privileges to update this User Account\');

","

-- delete rules

create or replace rule \\"_DELETE\\" as on delete to xm.user_account
  do instead nothing;

"}', 

-- Conditions, Comment, System

E'{"checkPrivilege(\'MaintainUsers\')"}', 'User Account Model', true);
