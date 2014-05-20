CREATE OR REPLACE FUNCTION getPrjId(pPrjNumber text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (pPrjNumber IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT prj_id INTO _returnVal
  FROM prj
  WHERE (prj_number=pPrjNumber);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Project Number % not found.', pPrjNumber;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
