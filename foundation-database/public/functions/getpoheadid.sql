CREATE OR REPLACE FUNCTION getPoheadId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPurchaseOrderNumber ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pPurchaseOrderNumber IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT pohead_id INTO _returnVal
  FROM pohead
  WHERE (pohead_number=pPurchaseOrderNumber);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Purchase Order % not found.'', pPurchaseOrderNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
