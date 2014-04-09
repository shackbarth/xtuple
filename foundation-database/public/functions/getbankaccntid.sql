CREATE OR REPLACE FUNCTION getBankAccntId(text) RETURNS INTEGER AS '
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pBankAccntName ALIAS FOR $1;
  _returnVal INTEGER;
BEGIN
  IF (pBankAccntName IS NULL) THEN
	RETURN NULL;
  END IF;

  SELECT bankaccnt_id INTO _returnVal
  FROM bankaccnt
  WHERE (UPPER(bankaccnt_name)=UPPER(pBankAccntName));

  IF (_returnVal IS NULL) THEN
	RAISE EXCEPTION ''Bank Account % not found.'', pBankAccntName;
  END IF;

  RETURN _returnVal;
END;
' LANGUAGE 'plpgsql';
