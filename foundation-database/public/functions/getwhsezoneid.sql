CREATE OR REPLACE FUNCTION getWhseZoneId(text, text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWhseCode ALIAS FOR $1;
  pWhseZoneName ALIAS FOR $2;
  _returnVal INTEGER;
BEGIN
  IF ((pWhseCode IS NULL) OR (pWhseZoneName IS NULL)) THEN
	RETURN NULL;
  END IF;

  SELECT whsezone_id INTO _returnVal
  FROM whsezone
  WHERE ( (whsezone_warehous_id=getWarehousId(pWhseCode, ''ACTIVE''))
      AND (UPPER(whsezone_name)=UPPER(pWhseZoneName)) );

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Whsezone % not found.'', pWhseZoneName;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
