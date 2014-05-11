
--SELECT dropIfExists('VIEW', 'usr');
CREATE OR REPLACE VIEW usr AS
  SELECT usesysid::integer AS usr_id,
         usename::text AS usr_username,
         COALESCE((SELECT usrpref_value FROM usrpref WHERE usrpref_username=usename AND usrpref_name='propername'), '') AS usr_propername,
         null::text AS usr_passwd,
         COALESCE((SELECT CAST(usrpref_value AS INTEGER) FROM usrpref WHERE usrpref_username=usename AND usrpref_name='locale_id'),
           COALESCE((SELECT locale_id FROM locale WHERE lower(locale_code) = 'default' LIMIT 1), (SELECT locale_id FROM locale ORDER BY locale_id LIMIT 1))) AS usr_locale_id,
         COALESCE((SELECT usrpref_value FROM usrpref WHERE usrpref_username=usename AND usrpref_name='initials'), '') AS usr_initials,
         COALESCE((SELECT CASE WHEN usrpref_value='t' THEN true ELSE false END FROM usrpref WHERE usrpref_username=usename AND usrpref_name='agent'), false) AS usr_agent,
         COALESCE((SELECT CASE WHEN usrpref_value='t' THEN true ELSE false END FROM usrpref WHERE usrpref_username=usename AND usrpref_name='active'), userCanLogin(usename)) AS usr_active,
         COALESCE((SELECT usrpref_value FROM usrpref WHERE usrpref_username=usename AND usrpref_name='email'), '') AS usr_email,
         COALESCE((SELECT usrpref_value FROM usrpref WHERE usrpref_username=usename AND usrpref_name='window'), '') AS usr_window
    FROM pg_user;


REVOKE ALL ON TABLE usr FROM PUBLIC;
GRANT  ALL ON TABLE usr TO GROUP xtrole;

