CREATE OR REPLACE FUNCTION getContrctId(pContrctNumber text) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (pContrctNumber IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT contrct_id INTO _returnVal
  FROM contrct
  WHERE (contrct_number=pContrctNumber);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Contract Number % not found.', pContrctNumber;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
