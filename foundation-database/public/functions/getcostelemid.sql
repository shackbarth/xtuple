CREATE OR REPLACE FUNCTION getCostElemId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCostElemType ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pCostElemType IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT costelem_id INTO _returnVal
  FROM costelem
  WHERE (costelem_type=pCostElemType);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Cost Element % not found.'', pCostElemType;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
