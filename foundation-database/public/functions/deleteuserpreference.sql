CREATE OR REPLACE FUNCTION deleteUserPreference(TEXT) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPrefname ALIAS FOR $1;
  _return BOOLEAN;

BEGIN

  SELECT deleteUserPreference(getEffectiveXtUser(), pPrefname) INTO _return;

  RETURN _return;

END;
' LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION deleteUserPreference(TEXT, TEXT) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
  pPrefname ALIAS FOR $2;

BEGIN

  DELETE FROM usrpref
  WHERE ( (usrpref_username=pUsername)
   AND (usrpref_name=pPrefname) );

  RETURN TRUE;

END;
' LANGUAGE plpgsql;
