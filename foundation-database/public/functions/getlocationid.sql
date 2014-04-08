CREATE OR REPLACE FUNCTION getLocationId(text,text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWarehouse ALIAS FOR $1;
  pLocation ALIAS FOR $2;
  _returnVal INTEGER;
BEGIN
  IF (pLocation IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT location_id INTO _returnVal
  FROM location
  WHERE ((location_warehous_id=getWarehousId(pWarehouse,''ACTIVE''))
  AND (formatLocationname(location_id)=pLocation))
  LIMIT 1;

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Location % not found in Warehouse %.'', pLocation, pWarehouse;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
