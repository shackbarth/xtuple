CREATE OR REPLACE FUNCTION getAropenId(text, character, text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustNumber ALIAS FOR $1;
  pDocType ALIAS FOR $2;
  pDocNumber ALIAS FOR $3;
  _returnVal INTEGER;
BEGIN
  IF ((pCustNumber IS NULL) OR (pDocType IS NULL) OR (pDocNumber IS NULL)) THEN
	RETURN NULL;
  END IF;

  SELECT aropen_id INTO _returnVal
  FROM aropen
  WHERE ((aropen_cust_id=getCustId(pCustNumber,true))
    AND  (UPPER(aropen_doctype)=UPPER(pDocType))
    AND  (UPPER(aropen_docnumber)=UPPER(pDocNumber)));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''AR Open Item % not found.'', pDocNumber;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
