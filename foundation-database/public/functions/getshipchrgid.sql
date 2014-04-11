CREATE OR REPLACE FUNCTION getShipChrgId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pShipChrgName ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pShipChrgName IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT shipchrg_id INTO _returnVal
  FROM shipchrg
  WHERE (shipchrg_name=pShipChrgName);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Ship Charge % not found.'', pShipChrgName;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
