CREATE OR REPLACE FUNCTION getIncdtResolutionId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pIncdtResolutionName ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pIncdtResolutionName IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT incdtresolution_id INTO _returnVal
  FROM incdtresolution
  WHERE (incdtresolution_name=pIncdtResolutionName);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Incident Resolution Name % not found.'', pIncdtResolutionName;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
