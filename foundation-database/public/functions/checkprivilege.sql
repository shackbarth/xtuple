CREATE OR REPLACE FUNCTION checkPrivilege(text) RETURNS BOOLEAN STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPrivilege ALIAS FOR $1;
  _result TEXT;
BEGIN
  SELECT priv_id INTO _result
    FROM priv, grppriv, usrgrp
   WHERE((usrgrp_grp_id=grppriv_grp_id)
     AND (grppriv_priv_id=priv_id)
     AND (priv_name=pPrivilege)
     AND (usrgrp_username=getEffectiveXtUser()));
  IF (FOUND) THEN
    RETURN true;
  END IF;

  SELECT priv_id INTO _result
  FROM priv, usrpriv
  WHERE ((priv_id=usrpriv_priv_id)
  AND (priv_name=pPrivilege)
  AND (usrpriv_username=getEffectiveXtUser()));
  
  IF (FOUND) THEN
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$ LANGUAGE 'plpgsql';
