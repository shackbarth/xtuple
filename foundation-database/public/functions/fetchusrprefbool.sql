CREATE OR REPLACE FUNCTION FetchUsrPrefBool(text) RETURNS BOOLEAN AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _pPrefName ALIAS FOR $1;
  _returnVal BOOLEAN;
BEGIN
  SELECT CASE 
    WHEN MIN(usrpref_value) = ''t'' THEN
     true
    ELSE
     false
    END INTO _returnVal
  FROM usrpref
  WHERE ( (usrpref_username=getEffectiveXtUser())
    AND   (usrpref_name=_pPrefName) );
  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
