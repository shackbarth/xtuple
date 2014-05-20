CREATE OR REPLACE FUNCTION deleteShippingChargeType (integer) RETURNS integer AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pShipchrgid ALIAS FOR $1;
  _check INTEGER;

BEGIN

--  Check to see if the passed shipchrg is used as a default for any customers
  SELECT cust_id INTO _check
  FROM custinfo
  WHERE (cust_shipchrg_id=pShipchrgid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

--  Check to see if the passed shipchrg is used as a default for any shiptos
  SELECT shipto_id INTO _check
  FROM shiptoinfo
  WHERE (shipto_shipchrg_id=pShipchrgid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -2;
  END IF;

--  Check to see if the passed shipchrg is used on any sales orders
  SELECT cohead_id INTO _check
  FROM cohead
  WHERE (cohead_shipchrg_id=pShipchrgid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -3;
  END IF;

--  Check to see if the passed shipchrg is used on any shippers
  SELECT shiphead_id INTO _check
  FROM shiphead
  WHERE (shiphead_shipchrg_id=pShipchrgid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -4;
  END IF;

--  Check to see if the passed shipchrg is used on any invoices
  SELECT invchead_id INTO _check
  FROM invchead
  WHERE (invchead_shipchrg_id=pShipchrgid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -5;
  END IF;

--  Delete the passed shipchrg
  DELETE FROM shipchrg
  WHERE (shipchrg_id=pShipchrgid);

  RETURN pShipchrgid;

END;
$$ LANGUAGE plpgsql;
