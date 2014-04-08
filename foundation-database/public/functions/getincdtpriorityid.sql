CREATE OR REPLACE FUNCTION getIncdtPriorityId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pIncdtPriorityName ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pIncdtPriorityName IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT incdtpriority_id INTO _returnVal
  FROM incdtpriority
  WHERE (incdtpriority_name=pIncdtPriorityName);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Incident Priority Name % not found.'', pIncdtPriorityName;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
