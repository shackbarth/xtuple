CREATE OR REPLACE FUNCTION getOpHeadId(text) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pOpHeadName ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  
  IF (pOpHeadName IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT ophead_id INTO _returnVal
  FROM ophead
  WHERE (UPPER(ophead_name)=UPPER(pOpHeadName));
  
  IF (_returnVal IS NULL) THEN
      RAISE EXCEPTION 'Opportunity % not found.', pOpHeadName;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
