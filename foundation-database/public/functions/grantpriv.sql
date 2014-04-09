CREATE OR REPLACE FUNCTION grantPriv(TEXT, INTEGER) RETURNS BOOL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
  pPrivid ALIAS FOR $2;
  _test INTEGER;

BEGIN

  SELECT usrpriv_id INTO _test
  FROM usrpriv
  WHERE ( (usrpriv_username=pUsername)
   AND (usrpriv_priv_id=pPrivid) );

  IF (FOUND) THEN
    RETURN FALSE;
  END IF;

  INSERT INTO usrpriv
  ( usrpriv_username, usrpriv_priv_id )
  VALUES
  ( pUsername, pPrivid );

  NOTIFY "usrprivUpdated";

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';

CREATE OR REPLACE FUNCTION grantPriv(TEXT, TEXT) RETURNS BOOL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
  pPrivname ALIAS FOR $2;
  _test INTEGER;

BEGIN

  SELECT usrpriv_id INTO _test
    FROM usrpriv
    JOIN priv ON (usrpriv_priv_id=priv_id)
  WHERE ((usrpriv_username=pUsername)
     AND (priv_name=pPrivname) );

  IF (FOUND) THEN
    RETURN FALSE;
  END IF;

  INSERT INTO usrpriv
  ( usrpriv_username, usrpriv_priv_id )
  SELECT pUsername, priv_id
    FROM priv
   WHERE (priv_name=pPrivname);

  NOTIFY "usrprivUpdated";

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';

