CREATE OR REPLACE FUNCTION getFreightClassId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pFreightClassCode ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pFreightClassCode IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT freightclass_id INTO _returnVal
  FROM freightclass
  WHERE (freightclass_code=pFreightClassCode);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Freight Class % not found.'', pFreightClassCode;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
