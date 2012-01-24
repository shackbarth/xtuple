create or replace view private.usr as

  select 
    usename::text as guid,
    usename::text as usr_username,
    coalesce((select 
              case when usrpref_value='t' then true 
                   else false 
              end 
              from usrpref 
              where usrpref_username=usename 
               and usrpref_name='active'), userCanLogin(usename)) as usr_active,
    coalesce((select usrpref_value 
              from usrpref 
              where usrpref_username=usename 
               and usrpref_name='propername'), '') as usr_propername,
    passwd as usr_passwd,
    coalesce((select usrpref_value 
              from usrpref 
              where usrpref_username=usename 
               and usrpref_name='initials'), '') as usr_initials,
    coalesce((select usrpref_value 
              from usrpref 
              where usrpref_username=usename AND usrpref_name='email'), '') AS usr_email,
    coalesce((select usrpref_value::integer 
              from usrpref 
              where usrpref_username=usename 
              and usrpref_name='locale_id'),
    coalesce((select locale_id 
              from locale 
              where lower(locale_code) = 'default' limit 1), 
              (select locale_id 
               from locale 
               order by locale_id limit 1))) as usr_locale_id,
    coalesce((select (usrpref_value = 't')
              from usrpref
              where ((usrpref_name='DisableExportContents')
               and (usrpref_username=usename))), false) as usr_disable_export,
    userCanCreateUsers(usename) as usr_can_create_users,
    true as usr_db_user
  from pg_user
  union all
  select
    useracct_username,
    useracct_username,
    useracct_active,
    useracct_propername,
    useracct_passwd,
    useracct_initials,
    useracct_email,
    useracct_locale_id,
    useracct_disable_export,
    false,
    false
  from private.useracct;
     
-- Rules

-- insert rules

create or replace rule "_CREATE" as on insert to private.usr
  do instead nothing;


-- create a regular user...

create or replace rule "_CREATE_USER" as on insert to private.usr
  where not new.usr_db_user do instead

insert into private.useracct (
  useracct_username,
  useracct_active,
  useracct_propername,
  useracct_initials,
  useracct_passwd,
  useracct_locale_id,
  useracct_email,
  useracct_disable_export )
values (
  new.usr_username,
  new.usr_active,
  new.usr_propername,
  new.usr_initials,
  new.usr_passwd,
  new.usr_locale_id,
  new.usr_email,
  new.usr_disable_export
);

-- create a database user...

create or replace rule "_CREATE_DB_USER" as on insert to private.usr
  where new.usr_db_user do instead (

select createUser( new.usr_username, new.usr_can_create_users );
select private.execute_query( 'alter group xtrole add user ' || new.usr_username );
select private.execute_query( 'alter user ' || new.usr_username || ' with password ''' || new.usr_passwd || '''' )
where new.usr_passwd != '        ';

select setUserCanCreateUsers(new.usr_username, new.usr_can_create_users);
select setUserPreference(new.usr_username, 'DisableExportContents', case when new.usr_disable_export then 't' else 'f' end );
select setUserPreference(new.usr_username, 'propername', new.usr_propername);
select setUserPreference(new.usr_username, 'email', new.usr_email);
select setUserPreference(new.usr_username, 'initials', new.usr_initials);
select setUserPreference(new.usr_username, 'locale_id', new.usr_locale_id::text);
select setUserPreference(new.usr_username, 'active', case when new.usr_active then 't' else 'f' end );

);

-- update rules

create or replace rule "_UPDATE" as on update to private.usr
  do instead nothing;

-- update a regular user...

create or replace rule "_UPDATE_USER" as on update to private.usr
  where not old.usr_db_user and not new.usr_db_user do instead (

update private.useracct set
  useracct_active = new.usr_active,
  useracct_propername = new.usr_propername,
  useracct_passwd = new.usr_passwd,
  useracct_initials = new.usr_initials,
  useracct_email = new.usr_email,
  useracct_locale_id = new.usr_locale_id
where ( useracct_username = old.usr_username );

);

-- change from a general user to a postgresql database user...

create or replace rule "_UPDATE_TO_DB_USER" as on update to private.usr
  where not old.usr_db_user and new.usr_db_user = true do instead (

select createUser( old.usr_username, new.usr_can_create_users );
select private.execute_query( 'alter group xtrole add user ' || old.usr_username );
select private.execute_query( 'alter user ' || old.usr_username || ' with password ''' || new.usr_passwd || '''' )
where new.usr_passwd != '        ';

select setUserCanCreateUsers(old.usr_username, new.usr_can_create_users);
select setUserPreference(old.usr_username, 'DisableExportContents', case when new.usr_disable_export then 't' else 'f' end );
select setUserPreference(old.usr_username, 'propername', new.usr_propername);
select setUserPreference(old.usr_username, 'email', new.usr_email);
select setUserPreference(old.usr_username, 'initials', new.usr_initials);
select setUserPreference(old.usr_username, 'locale_id', new.usr_locale_id::text);
select setUserPreference(old.usr_username, 'active', case when new.usr_active then 't' else 'f' end );

delete from private.useracct where ( useracct_username = old.usr_username );

);

-- once a databse user, always a database user...

create or replace rule "_UPDATE_DB_USER" as on update to private.usr
  where old.usr_db_user do instead (

select setUserCanCreateUsers(old.usr_username, new.usr_can_create_users);
select setUserPreference(old.usr_username, 'DisableExportContents', case when new.usr_disable_export then 't' else 'f' end );
select setUserPreference(old.usr_username, 'propername', new.usr_propername);
select setUserPreference(old.usr_username, 'email', new.usr_email);
select setUserPreference(old.usr_username, 'initials', new.usr_initials);
select setUserPreference(old.usr_username, 'locale_id', new.usr_locale_id::text);
select setUserPreference(old.usr_username, 'active', case when new.usr_active then 't' else 'f' end );

);

-- delete rules

create or replace rule "_DELETE" as on delete to private.usr
  do instead nothing;


