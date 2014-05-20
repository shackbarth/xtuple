CREATE OR REPLACE FUNCTION getShipViaId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pShipViaCode ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pShipViaCode IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT shipvia_id INTO _returnVal
  FROM shipvia
  WHERE (shipvia_code=pShipViaCode);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''ShipVia Code % not found.'', pShipViaCode;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
