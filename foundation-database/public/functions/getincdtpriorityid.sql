CREATE OR REPLACE FUNCTION getIncdtPriorityId(pIncdtPriorityName text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (pIncdtPriorityName IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT incdtpriority_id INTO _returnVal
  FROM incdtpriority
  WHERE (incdtpriority_name=pIncdtPriorityName);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Incident Priority Name % not found.', pIncdtPriorityName;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
