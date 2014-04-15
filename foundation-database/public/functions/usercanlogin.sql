--DROP VIEW     IF EXISTS usr;
--DROP FUNCTION IF EXISTS userCanLogin(TEXT);
CREATE OR REPLACE FUNCTION userCanLogin(pUsername TEXT) RETURNS BOOLEAN AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _isactive  BOOLEAN;
  _mode      TEXT;
BEGIN
  IF (isDBA(pUsername) OR userCanCreateUsers(pUsername)) THEN
    RETURN TRUE;

  ELSIF (pg_has_role(pUsername, 'xtrole', 'member')) THEN
    _mode := COALESCE(fetchMetricText('AllowedUserLogins'), '');

    IF (_mode = 'AdminOnly') THEN
      RETURN FALSE; -- administrators were checked above
    END IF;

    IF (_mode NOT IN ('AdminOnly','ActiveOnly','Any')) THEN
      _mode := 'ActiveOnly';
    END IF;

    SELECT (usrpref_value = 't') INTO _isactive
      FROM usrpref
     WHERE usrpref_username = pUsername
       AND usrpref_name = 'active';

    IF (_isactive OR _mode = 'Any') THEN
      RETURN TRUE;
    END IF;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE 'plpgsql';

