CREATE OR REPLACE FUNCTION getPrjTaskId(text, text) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPrjNumber ALIAS FOR $1;
  pTaskNumber ALIAS FOR $2;
  _returnVal INTEGER;
BEGIN
  IF (pPrjNumber IS NULL OR pTaskNumber IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT prjtask_id INTO _returnVal
  FROM prjtask
    JOIN prj ON (prj_id=prjtask_prj_id)
  WHERE ((prj_number=pPrjNumber)
  AND (prjtask_number=pTaskNumber));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Project Task Number %-% not found.', pPrjNumber, pTaskNumber;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql' STABLE;
