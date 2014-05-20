CREATE OR REPLACE FUNCTION getClassCodeId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pClassCode ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pClassCode IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT classcode_id INTO _returnVal
  FROM classcode
  WHERE (classcode_code=pClassCode);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Class Code % not found.'', pClassCode;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
