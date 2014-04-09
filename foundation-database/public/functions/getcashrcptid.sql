CREATE OR REPLACE FUNCTION getCashrcptId(text, text, text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustNumber ALIAS FOR $1;
  pFundsType ALIAS FOR $2;
  pDocNumber ALIAS FOR $3;
  _returnVal INTEGER;
BEGIN
  IF ((pCustNumber IS NULL) OR (pFundsType IS NULL) OR (pDocNumber IS NULL)) THEN
	RETURN NULL;
  END IF;

  SELECT cashrcpt_id INTO _returnVal
  FROM cashrcpt
  WHERE ((cashrcpt_cust_id=getCustId(pCustNumber,true))
    AND  (UPPER(cashrcpt_fundstype)=UPPER(pFundsType))
    AND  (UPPER(cashrcpt_docnumber)=UPPER(pDocNumber)));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Cash Receipt % not found.'', pDocNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
