CREATE OR REPLACE FUNCTION getCoItemId(text,text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSalesOrderNumber	ALIAS FOR $1;
  pLineNumber 	    	ALIAS FOR $2;
  _linenumber		INTEGER;
  _subnumber		INTEGER;
  _returnVal 		INTEGER;
BEGIN
  IF (pSalesOrderNumber IS NULL OR pLineNumber IS NULL) THEN
    RETURN NULL;
  END IF;

  --Parse Line Number
  IF (position(''.'' in pLineNumber) > 0) THEN
    _linenumber	:= CAST(substring(pLineNumber from 1 for position(''.'' in pLineNumber)-1) AS INTEGER);
    _subnumber	:= CAST(substring(pLineNumber from position(''.'' in pLineNumber)+1 for length(pLineNumber)) AS INTEGER);
  ELSE
    _linenumber	:= CAST(pLineNumber AS INTEGER);
    _subnumber	:= 0;
  END IF;

  SELECT coitem_id INTO _returnVal
  FROM cohead, coitem
  WHERE ((cohead_number=pSalesOrderNumber)
  AND (coitem_cohead_id=cohead_id)
  AND (coitem_linenumber=_linenumber)
  AND (coitem_subnumber=_subnumber));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Sales Order % not found.'', pSalesOrderNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
