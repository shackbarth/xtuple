CREATE OR REPLACE FUNCTION getProdCatId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pProdCat ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pProdCat IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT prodcat_id INTO _returnVal
  FROM prodcat
  WHERE (prodcat_code=pProdCat);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Product Category % not found.'', pProdCat;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
