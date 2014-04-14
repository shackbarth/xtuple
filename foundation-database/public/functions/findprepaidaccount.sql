
CREATE OR REPLACE FUNCTION findPrepaidAccount(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCustid ALIAS FOR $1;
  _accntid INTEGER;

BEGIN

  IF (NOT fetchMetricBool('InterfaceARToGL')) THEN
    RETURN 0;
  END IF;

--  Check for a Customer Type specific Account
  SELECT araccnt_prepaid_accnt_id INTO _accntid
    FROM araccnt
    JOIN custinfo ON (araccnt_custtype_id=cust_custtype_id)
  WHERE (cust_id=pCustid);
  IF (FOUND) THEN
    RETURN _accntid;
  END IF;

--  Check for a Customer Type pattern
  SELECT araccnt_prepaid_accnt_id INTO _accntid
    FROM araccnt
    JOIN custtype ON (custtype_code ~ araccnt_custtype)
    JOIN custinfo ON (cust_custtype_id=custtype_id)
  WHERE ((araccnt_custtype_id=-1)
     AND (cust_id=pCustid) );
  IF (FOUND) THEN
    RETURN _accntid;
  END IF;

  RETURN -1;

END;
$$ LANGUAGE 'plpgsql';

