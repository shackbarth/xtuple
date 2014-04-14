CREATE OR REPLACE FUNCTION getSaleTypeId(pSaleType TEXT) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  IF (pSaleType IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT saletype_id INTO _returnVal
  FROM saletype
  WHERE (saletype_code=UPPER(pSaleType));

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'Sale Type % not found.', pSaleType;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
