CREATE OR REPLACE FUNCTION getSalesOrderId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSalesOrderNumber ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pSalesOrderNumber IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT cohead_id INTO _returnVal
  FROM cohead
  WHERE (cohead_number=pSalesOrderNumber);

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Sales Order Number % not found.'', pSalesOrderNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
