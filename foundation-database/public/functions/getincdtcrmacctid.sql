CREATE OR REPLACE FUNCTION getIncdtCrmAcctId(integer) RETURNS INTEGER AS '
-- Copyright (c) 1999-2012 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pIncidentNumber ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pIncidentNumber IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT incdt_crmacct_id INTO _returnVal
  FROM incdt
  WHERE (incdt_number=pIncidentNumber);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Incident Number % not found.'', pIncidentNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
