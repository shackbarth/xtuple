CREATE OR REPLACE FUNCTION userId(TEXT) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
  _userId INTEGER;

BEGIN

  SELECT usesysid INTO _userId
  FROM pg_user
  WHERE (usename=pUsername);

  IF (FOUND) THEN
    RETURN _userId;
  ELSE
    RETURN -1;
  END IF;

END;
' LANGUAGE 'plpgsql';
