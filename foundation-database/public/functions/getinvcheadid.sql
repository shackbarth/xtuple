CREATE OR REPLACE FUNCTION getInvcheadId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pInvcNumber ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pInvcNumber IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT invchead_id INTO _returnVal
  FROM invchead
  WHERE (UPPER(invchead_invcnumber)=UPPER(pInvcNumber));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Invoice % not found.'', pInvcNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
