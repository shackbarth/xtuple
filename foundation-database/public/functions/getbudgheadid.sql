CREATE OR REPLACE FUNCTION getBudgheadId(text)
  RETURNS integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBudghead ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pBudghead IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT budghead_id INTO _returnVal
  FROM budghead
  WHERE (budghead_name=(pBudghead));

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'Budget % not found.', pBudghead;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
