CREATE OR REPLACE FUNCTION getIncdtResolutionId(pIncdtResolutionName text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (pIncdtResolutionName IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT incdtresolution_id INTO _returnVal
  FROM incdtresolution
  WHERE (incdtresolution_name=pIncdtResolutionName);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Incident Resolution Name % not found.', pIncdtResolutionName;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
