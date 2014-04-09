CREATE OR REPLACE FUNCTION getIncidentId(pIncidentNumber integer) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (pIncidentNumber IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT incdt_id INTO _returnVal
  FROM incdt
  WHERE (incdt_number=pIncidentNumber);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION 'Incident Number % not found.', pIncidentNumber;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
