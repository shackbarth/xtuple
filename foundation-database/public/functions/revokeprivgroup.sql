CREATE OR REPLACE FUNCTION revokePrivGroup(INTEGER, INTEGER) RETURNS BOOL AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pGrpid ALIAS FOR $1;
  pPrivid ALIAS FOR $2;

BEGIN

  DELETE FROM grppriv
  WHERE ( (grppriv_grp_id=pGrpid)
   AND (grppriv_priv_id=pPrivid) );

  NOTIFY "usrprivUpdated";

  RETURN TRUE;

END;
' LANGUAGE 'plpgsql';

