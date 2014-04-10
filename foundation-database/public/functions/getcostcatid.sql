CREATE OR REPLACE FUNCTION getCostCatId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCostCat ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pCostCat IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT costcat_id INTO _returnVal
  FROM costcat
  WHERE (costcat_code=pCostCat);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Cost Category Code % not found.'', pCostCat;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
