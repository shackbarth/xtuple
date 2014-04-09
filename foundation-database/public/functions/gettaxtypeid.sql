CREATE OR REPLACE FUNCTION getTaxTypeId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTaxType ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pTaxType IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT taxtype_id INTO _returnVal
  FROM taxtype
  WHERE (taxtype_name=pTaxType);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Tax Type % not found.'', pTaxType;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
