
CREATE OR REPLACE FUNCTION openARItemsValue(INTEGER, INTEGER) RETURNS NUMERIC AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustid ALIAS FOR $1;
  pPeriodid ALIAS FOR $2;
  _value NUMERIC;

BEGIN

  SELECT SUM( CASE WHEN (aropen_doctype IN (''C'', ''R'')) THEN ((aropen_amount - aropen_paid) * -1)
                   ELSE (aropen_amount - aropen_paid)
              END )  INTO _value
  FROM aropen
  WHERE ( (aropen_open)
    AND (aropen_cust_id=pCustid)
    AND (aropen_duedate BETWEEN findPeriodStart(pPeriodid) AND findPeriodEnd(pPeriodid)) );

  IF (_value IS NULL) THEN
    _value := 0;
  END IF;

  RETURN _value;

END;
' LANGUAGE 'plpgsql';

