select dropIfExists('VIEW', 'user', 'xm');

-- return rule

create or replace view xm.user as 

select
  usr_username as username,
  usr_active as is_active,
  usr_propername as propername,
  usr_passwd as password,
  usr_initials as initials,
  usr_email as email,
  usr_locale_id as locale,
  coalesce( ( 
    select ( usrpref_value = 't' )
    from usrpref
    where ( ( usrpref_name = 'DisableExportContents' )
     and ( usrpref_username = usr_username ) )
  ), false ) as disable_export,
  public.userCanCreateUsers(usr_username) as can_create_users,
  true as is_database_user,
  rtrim(ltrim(array(
    select usrpriv_id
    from public.usrpriv
    where usrpriv_username = usr_username )::text,'{'),'}') as privileges,
  rtrim(ltrim(array(
    select usrgrp_id
    from public.usrgrp
    where usrgrp_username = usr_username )::text,'{'),'}') as user_roles
from public.usr
union all
select
  user_username as username,
  user_active as is_active,
  user_propername as propername,
  user_passwd as password,
  user_initials as initials,
  user_email as email,
  user_locale_id as locale,
  user_disable_export,
  false as can_create_users,
  false as is_database_user,
  rtrim(ltrim(array(
    select usrpriv_id
    from public.usrpriv
    where usrpriv_username = user_username )::text,'{'),'}') as privileges,
  rtrim(ltrim(array(
    select usrgrp_id
    from public.usrgrp
    where usrgrp_username = user_username )::text,'{'),'}') as user_roles
from private.user;

-- insert rules

create or replace rule "_CREATE" as on insert to xm.user
  do instead nothing;

-- create a regular user...

create or replace rule "_CREATE_USER" as on insert to xm.user
  where not new.is_database_user do instead

insert into private.user (
  user_username,
  user_active,
  user_propername,
  user_initials,
  user_passwd,
  user_locale_id,
  user_email,
  user_disable_export )
values (
  new.username,
  new.is_active,
  new.propername,
  new.initials,
  new.password,
  new.locale,
  new.email,
  new.disable_export
);

-- create a database user...

create or replace rule "_CREATE_DB_USER" as on insert to xm.user
  where new.is_database_user do instead (

select createUser( new.username, new.can_create_users );
select private.execute_query( 'alter group xtrole add user ' || new.username );
select private.execute_query( 'alter user ' || new.username || ' with password ''' || new.password || '''' )
where new.password != '        ';

select setUserCanCreateUsers(new.username, new.can_create_users);
select setUserPreference(new.username, 'DisableExportContents', case when new.disable_export then 't' else 'f' end );
select setUserPreference(new.username, 'propername', new.propername);
select setUserPreference(new.username, 'email', new.email);
select setUserPreference(new.username, 'initials', new.initials);
select setUserPreference(new.username, 'locale_id', new.locale::text);
select setUserPreference(new.username, 'active', case when new.is_active then 't' else 'f' end );

);

-- update rules

create or replace rule "_UPDATE" as on update to xm.user
  do instead nothing;

-- update a regular user...

create or replace rule "_UPDATE_USER" as on update to xm.user
  where not old.is_database_user and not new.is_database_user do instead (

update private.user set
  user_active = new.is_active,
  user_propername = new.propername,
  user_passwd = new.password,
  user_initials = new.initials,
  user_email = new.email,
  user_locale_id = new.locale
where ( user_username = old.username );

);

-- change from a general user to a postgresql database user...

create or replace rule "_UPDATE_TO_DB_USER" as on update to xm.user
  where not old.is_database_user and new.is_database_user = true do instead (

select createUser( old.username, new.can_create_users );
select private.execute_query( 'alter group xtrole add user ' || old.username );
select private.execute_query( 'alter user ' || old.username || ' with password ''' || new.password || '''' )
where new.password != '        ';

select setUserCanCreateUsers(old.username, new.can_create_users);
select setUserPreference(old.username, 'DisableExportContents', case when new.disable_export then 't' else 'f' end );
select setUserPreference(old.username, 'propername', new.propername);
select setUserPreference(old.username, 'email', new.email);
select setUserPreference(old.username, 'initials', new.initials);
select setUserPreference(old.username, 'locale_id', new.locale::text);
select setUserPreference(old.username, 'active', case when new.is_active then 't' else 'f' end );

delete from private.user where ( user_username = old.username );

);

-- once a databse user, always a database user...

create or replace rule "_UPDATE_DB_USER" as on update to xm.user
  where old.is_database_user do instead (

select setUserCanCreateUsers(old.username, new.can_create_users);
select setUserPreference(old.username, 'DisableExportContents', case when new.disable_export then 't' else 'f' end );
select setUserPreference(old.username, 'propername', new.propername);
select setUserPreference(old.username, 'email', new.email);
select setUserPreference(old.username, 'initials', new.initials);
select setUserPreference(old.username, 'locale_id', new.locale::text);
select setUserPreference(old.username, 'active', case when new.is_active then 't' else 'f' end );

);

-- delete rules

create or replace rule "_DELETE" as on delete to xm.user
  do instead nothing;
