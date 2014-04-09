
CREATE OR REPLACE FUNCTION getIncdtCatId(pIncdtCatName text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (pIncdtCatName IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT incdtcat_id INTO _returnVal
  FROM incdtcat
  WHERE (incdtcat_name=pIncdtCatName);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Incident Category Name % not found.', pIncdtCatName;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';

