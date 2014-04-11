CREATE OR REPLACE FUNCTION getShipFormId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pShipFormName ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pShipFormName IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT shipform_id INTO _returnVal
  FROM shipform
  WHERE (shipform_name=pShipFormName) LIMIT 1;

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Ship Form % not found.'', pShipFormName;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
