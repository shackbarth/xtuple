select xt.create_view('xt.usr', $$

  select   
    useracct_id as usr_id,  
    useracct_username as usr_username,  
    useracct_propername as usr_propername,  
    null::text as usr_passwd,  
    useracct_locale_id usr_locale_id,  
    useracct_initials as usr_initials,  
    coalesce((select case when usrpref_value='t' then true else false end from usrpref where usrpref_username=useracct_username and usrpref_name='agent'), false) AS usr_agent,  
    useracct_active as usr_active,  
    useracct_email as usr_email,  
    coalesce((select usrpref_value from usrpref where usrpref_username=useracct_username and usrpref_name='window'), '') AS usr_window,  
    (usename is not null) as usr_db_user  
  from xt.useracct  
    left join pg_user on (usename=useracct_username);
    
$$);

