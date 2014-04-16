CREATE OR REPLACE FUNCTION getPoitemId(text,integer) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pPurchaseOrderNumber	ALIAS FOR $1;
  pLineNumber 	    	ALIAS FOR $2;
  _returnVal 		INTEGER;
BEGIN
  IF (pPurchaseOrderNumber IS NULL OR pLineNumber IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT poitem_id INTO _returnVal
  FROM pohead, poitem
  WHERE ((pohead_number=pPurchaseOrderNumber)
  AND (poitem_pohead_id=pohead_id)
  AND (poitem_linenumber=pLineNumber));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Purchase Order % not found.'', pSalesOrderNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
