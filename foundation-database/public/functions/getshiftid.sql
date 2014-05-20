CREATE OR REPLACE FUNCTION getShiftId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pShiftNumber ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (COALESCE(TRIM(pShiftNumber), '''') = '''') THEN
      RETURN NULL;
  END IF;

  SELECT shift_id INTO _returnVal
  FROM shift
  WHERE (UPPER(shift_number)=UPPER(pShiftNumber));

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION ''Shift % not found.'', pShiftNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
