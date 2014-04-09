CREATE OR REPLACE FUNCTION FetchPrefWarehousId() RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _result INTEGER;
BEGIN
    SELECT CAST(usrpref_value AS INTEGER) INTO _result
    FROM usrpref
    WHERE ((usrpref_username=getEffectiveXtUser())
    AND (usrpref_name=''PreferredWarehouse''));

    RETURN _result;
END;
' LANGUAGE 'plpgsql';
