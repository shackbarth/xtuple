CREATE OR REPLACE FUNCTION getLocationId(pWarehouse text,
                                         pLocation text) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (pLocation IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT location_id INTO _returnVal
  FROM location
  WHERE ((location_warehous_id=getWarehousId(pWarehouse,'ACTIVE'))
    AND  (location_formatname=pLocation))
  LIMIT 1;

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Location % not found in Warehouse %.', pLocation, pWarehouse;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';

