drop view if exists xt.nodeusr cascade;

create or replace view xt.nodeusr as

  select
    useracct_id as nodeusr_id,
    useracct_username as nodeusr_username,
    (select 
       case when usrpref_value='t' then true 
         else false 
       end 
       from usrpref 
       where usrpref_username=useracct_username
         and usrpref_name='active') as nodeusr_active,
    coalesce((select usrpref_value 
              from usrpref 
              where usrpref_username=useracct_username
               and usrpref_name='propername'), '') as nodeusr_propername,
    coalesce((select usrpref_value 
              from usrpref 
              where usrpref_username=useracct_username
               and usrpref_name='initials'), '') as nodeusr_initials,
    coalesce((select usrpref_value 
              from usrpref 
              where usrpref_username=useracct_username AND usrpref_name='email'), '') AS nodeusr_email,
    coalesce((select usrpref_value::integer 
              from usrpref 
              where usrpref_username=usename 
              and usrpref_name='locale_id'),
    coalesce((select locale_id 
              from locale 
              where lower(locale_code) = 'default' limit 1), 
              (select locale_id 
               from locale 
               order by locale_id limit 1))) as nodeusr_locale_id,
    coalesce((select (usrpref_value = 't')
              from usrpref
              where ((usrpref_name='DisableExportContents')
               and (usrpref_username=useracct_username))), false) as nodeusr_disable_export,
    (usename is not null) as nodeusr_db_user
  from xt.useracct
    left join pg_user on (usename=useracct_username);

grant all on table xt.nodeusr to xtrole;
     
-- Rules

-- insert rules

create or replace rule "_CREATE" as on insert to xt.nodeusr
  do instead (

insert into xt.useracct (
  useracct_username )
values (
  new.nodeusr_username
);

select setUserPreference(new.nodeusr_username, 'DisableExportContents', case when new.nodeusr_disable_export then 't' else 'f' end );
select setUserPreference(new.nodeusr_username, 'propername', new.nodeusr_propername);
select setUserPreference(new.nodeusr_username, 'email', new.nodeusr_email);
select setUserPreference(new.nodeusr_username, 'initials', new.nodeusr_initials);
select setUserPreference(new.nodeusr_username, 'locale_id', new.nodeusr_locale_id::text);
select setUserPreference(new.nodeusr_username, 'active', case when new.nodeusr_active then 't' else 'f' end );
);

-- update rules

create or replace rule "_UPDATE" as on update to xt.nodeusr
 do instead (

select setUserPreference(old.nodeusr_username, 'DisableExportContents', case when new.nodeusr_disable_export then 't' else 'f' end );
select setUserPreference(old.nodeusr_username, 'propername', new.nodeusr_propername);
select setUserPreference(old.nodeusr_username, 'email', new.nodeusr_email);
select setUserPreference(old.nodeusr_username, 'initials', new.nodeusr_initials);
select setUserPreference(old.nodeusr_username, 'locale_id', new.nodeusr_locale_id::text);
select setUserPreference(old.nodeusr_username, 'active', case when new.nodeusr_active then 't' else 'f' end );

);

-- delete rules

create or replace rule "_DELETE" as on delete to xt.nodeusr
  do instead nothing;


