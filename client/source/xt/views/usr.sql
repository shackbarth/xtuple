drop view if exists xt.usr cascade;

create or replace view xt.usr as
  select 
    nodeusr_id as usr_id,
    nodeusr_username as usr_username,
    nodeusr_propername as usr_propername,
    null::text as usr_passwd,
    nodeusr_locale_id usr_locale_id,
    nodeusr_initials as usr_initials,
    coalesce((select case when usrpref_value='t' then true else false end from usrpref where usrpref_username=nodeusr_username and usrpref_name='agent'), false) AS usr_agent,
    nodeusr_active as usr_active,
    nodeusr_email as usr_email,
    coalesce((select usrpref_value from usrpref where usrpref_username=nodeusr_username and usrpref_name='window'), '') AS usr_window,
    nodeusr_db_user as usr_db_user
  from xt.nodeusr;

revoke all on xt.usr from public;
grant all on table xt.usr to group xtrole;

