
CREATE OR REPLACE FUNCTION deleteShippingCharge(INTEGER) RETURNS INTEGER AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pShipchrgid ALIAS FOR $1;

BEGIN

  IF EXISTS(SELECT 1
              FROM custinfo
             WHERE (cust_shipchrg_id=pShipchrgid)) THEN
    RETURN -1;
  END IF;

  DELETE FROM shipchrg
  WHERE (shipchrg_id=pShipchrgid);

  RETURN pShipchrgid;

END;
$$ LANGUAGE 'plpgsql';

