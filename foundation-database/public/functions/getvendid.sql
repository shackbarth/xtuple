CREATE OR REPLACE FUNCTION getVendId(text) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendNumber ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pVendNumber IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT vend_id INTO _returnVal
    FROM vendinfo
   WHERE (vend_number=pVendNumber);

  IF (_returnVal IS NULL) THEN
    RAISE EXCEPTION 'Vendor Number % not found.', pVendNumber;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
