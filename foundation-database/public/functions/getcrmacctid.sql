CREATE OR REPLACE FUNCTION getCrmAcctId(pAcctNumber text) RETURNS INTEGER STABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  _returnVal INTEGER;
BEGIN
  
  IF (pAcctNumber IS NULL) THEN
    RETURN NULL;
  END IF;

  SELECT crmacct_id INTO _returnVal
  FROM crmacct
  WHERE (UPPER(crmacct_number)=UPPER(pAcctNumber));
  
  IF (_returnVal IS NULL) THEN
      RAISE EXCEPTION 'CRM Account Number % not found.', pAcctNumber;
  END IF;

  RETURN _returnVal;
END;
$$ LANGUAGE 'plpgsql';
