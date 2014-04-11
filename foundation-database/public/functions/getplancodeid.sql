CREATE OR REPLACE FUNCTION getPlanCodeId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPlanCode ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pPlanCode IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT plancode_id INTO _returnVal
  FROM plancode
  WHERE (plancode_code=pPlanCode);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Plan Code % not found.'', pPlanCode;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
