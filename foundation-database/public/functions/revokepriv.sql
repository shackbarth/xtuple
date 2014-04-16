
CREATE OR REPLACE FUNCTION revokePriv(TEXT, INTEGER) RETURNS BOOL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
  pPrivid ALIAS FOR $2;

BEGIN

  DELETE FROM usrpriv
  WHERE ( (usrpriv_username=pUsername)
   AND (usrpriv_priv_id=pPrivid) );

  NOTIFY "usrprivUpdated";

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION revokePriv(TEXT, TEXT) RETURNS BOOL AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pUsername ALIAS FOR $1;
  pPrivname ALIAS FOR $2;

BEGIN

  DELETE FROM usrpriv
  WHERE ( (usrpriv_username=pUsername)
   AND (usrpriv_priv_id IN (SELECT priv_id
                              FROM priv
                             WHERE priv_name=pPrivname) ));

  NOTIFY "usrprivUpdated";

  RETURN TRUE;

END;
$$ LANGUAGE 'plpgsql';

