CREATE OR REPLACE FUNCTION getCurrId(pCurrName text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (pCurrName IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT curr_id INTO _returnVal
  FROM curr_symbol
  WHERE (curr_abbr=pCurrName);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Currency % not found.', pCurrName;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
