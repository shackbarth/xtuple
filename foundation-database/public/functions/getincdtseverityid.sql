CREATE OR REPLACE FUNCTION getIncdtSeverityId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pIncdtSeverityName ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pIncdtSeverityName IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT incdtseverity_id INTO _returnVal
  FROM incdtseverity
  WHERE (incdtseverity_name=pIncdtSeverityName);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Incident Severity Name % not found.'', pIncdtSeverityName;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
