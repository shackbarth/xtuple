CREATE OR REPLACE FUNCTION getTaxId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pTaxCode ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pTaxCode IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT tax_id INTO _returnVal
  FROM tax
  WHERE (tax_code=pTaxCode);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Tax Code % not found.'', pTaxCode;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
