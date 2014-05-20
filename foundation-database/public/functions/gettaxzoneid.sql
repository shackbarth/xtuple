CREATE OR REPLACE FUNCTION getTaxZoneId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTaxZone ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pTaxZone IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT taxzone_id INTO _returnVal
  FROM taxzone
  WHERE (taxzone_code=pTaxZone);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Tax Zone % not found.'', pTaxZone;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
