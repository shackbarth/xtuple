select xt.create_view('xt.usrinfo', $$

SELECT pg_user.usesysid::integer AS usr_id, 
pg_user.usename::text AS usr_username, 
COALESCE(( 
  SELECT usrpref.usrpref_value
  FROM usrpref
  WHERE usrpref.usrpref_username = pg_user.usename::text AND usrpref.usrpref_name = 'propername'::text), ''::text
) AS usr_propername, 
NULL::text AS usr_passwd, 
COALESCE(( 
  SELECT usrpref.usrpref_value::integer AS usrpref_value
  FROM usrpref
  WHERE usrpref.usrpref_username = pg_user.usename::text AND usrpref.usrpref_name = 'locale_id'::text
  ), 
  COALESCE(( SELECT locale.locale_id
  FROM locale
  WHERE lower(locale.locale_code) = 'default'::text LIMIT 1), ( SELECT locale.locale_id
  FROM locale
  ORDER BY locale.locale_id LIMIT 1))
) AS usr_locale_id, 
COALESCE(( SELECT usrpref.usrpref_value
  FROM usrpref
  WHERE usrpref.usrpref_username = pg_user.usename::text AND usrpref.usrpref_name = 'initials'::text), ''::text
) AS usr_initials, 
COALESCE(( SELECT 
  CASE
  WHEN usrpref.usrpref_value = 't'::text THEN true
  ELSE false
  END AS "case"
  FROM usrpref
  WHERE usrpref.usrpref_username = pg_user.usename::text AND usrpref.usrpref_name = 'UseEnhancedAuth'::text), false
) AS usr_enhancedAuth, 
COALESCE(( SELECT 
  CASE
  WHEN usrpref.usrpref_value = 't'::text THEN true
  ELSE false
  END AS "case"
  FROM usrpref
  WHERE usrpref.usrpref_username = pg_user.usename::text AND usrpref.usrpref_name = 'agent'::text), false
) AS usr_agent, 
COALESCE(( SELECT 
  CASE
  WHEN usrpref.usrpref_value = 't'::text THEN true
  ELSE false
  END AS "case"
  FROM usrpref
  WHERE usrpref.usrpref_username = pg_user.usename::text AND usrpref.usrpref_name = 'active'::text), 
  usercanlogin(pg_user.usename::text)
) AS usr_active, 
COALESCE(( SELECT usrpref.usrpref_value
  FROM usrpref
  WHERE usrpref.usrpref_username = pg_user.usename::text AND usrpref.usrpref_name = 'email'::text), ''::text
) AS usr_email, 
current_database() as usr_org,
COALESCE(( SELECT usrpref.usrpref_value
  FROM usrpref
  WHERE usrpref.usrpref_username = pg_user.usename::text AND usrpref.usrpref_name = 'window'::text), ''::text
) AS usr_window
FROM pg_user;

$$, false);

-- remove old trigger if any
drop trigger if exists usr_did_change on xt.usrinfo;

-- create trigger
create trigger usr_did_change instead of insert or update on xt.usrinfo for each row execute procedure xt.usr_did_change();



