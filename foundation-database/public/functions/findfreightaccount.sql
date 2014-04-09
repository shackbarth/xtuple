CREATE OR REPLACE FUNCTION findFreightAccount(INTEGER) RETURNS INTEGER AS $$
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
  SELECT araccnt_freight_accnt_id INTO _accntid
  FROM araccnt, custinfo
  WHERE ( (araccnt_custtype_id=cust_custtype_id)
   AND (cust_id=pCustid) );
  IF (FOUND) THEN
    RETURN _accntid;
  END IF;

--  Check for a Customer Type pattern
  SELECT araccnt_freight_accnt_id INTO _accntid
  FROM araccnt, custinfo, custtype
  WHERE ( (custtype_code ~ araccnt_custtype)
   AND (cust_custtype_id=custtype_id)
   AND (araccnt_custtype_id=-1)
   AND (cust_id=pCustid) );
  IF (FOUND) THEN
    RETURN _accntid;
  END IF;

--  Find the default
  SELECT metric_value::INTEGER INTO _accntid
  FROM metric
  WHERE (metric_name='FreightAccount');
  IF (FOUND) THEN
    RETURN _accntid;
  END IF;

  RETURN -1;

END;
$$ LANGUAGE 'plpgsql';
