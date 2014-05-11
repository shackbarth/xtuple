
CREATE OR REPLACE FUNCTION deleteCustomerType(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pCusttypeid ALIAS FOR $1;

BEGIN

  IF EXISTS(SELECT 1
              FROM custinfo
             WHERE (cust_custtype_id=pCusttypeid)) THEN
    RETURN -1;
  END IF;

  DELETE FROM ipsass
  WHERE (ipsass_custtype_id=pCusttypeid);

  DELETE FROM salesaccnt
  WHERE (salesaccnt_custtype_id=pCusttypeid);

  DELETE FROM araccnt
  WHERE (araccnt_custtype_id=pCusttypeid);

  DELETE FROM custform
  WHERE (custform_custtype_id=pCusttypeid);

  DELETE FROM custtype
  WHERE (custtype_id=pCusttypeid);

  RETURN pCusttypeid;

END;
$$ LANGUAGE 'plpgsql';

