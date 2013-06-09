select xt.create_view('xt.usrinfo', $$

SELECT *,
current_database()::text as usr_org,
COALESCE(( SELECT
  CASE
  WHEN usrpref.usrpref_value = 't'::text THEN true
  ELSE false
  END AS "case"
  FROM usrpref
  WHERE usrpref.usrpref_username = usr.usr_username::text AND usrpref.usrpref_name = 'UseEnhancedAuthentication'::text), false
) AS usr_enhancedauth,
COALESCE(( SELECT
  CASE
  WHEN usrpref.usrpref_value = 't'::text THEN true
  ELSE false
  END AS "case"
  FROM usrpref
  WHERE usrpref.usrpref_username = usr.usr_username::text AND usrpref.usrpref_name = 'DisableExportContents'::text), false
) AS usr_disable_export
FROM usr;

$$, false);

-- remove old trigger if any
drop trigger if exists usr_did_change on xt.usrinfo;

-- create trigger
create trigger usr_did_change instead of insert or update on xt.usrinfo for each row execute procedure xt.usr_did_change();



