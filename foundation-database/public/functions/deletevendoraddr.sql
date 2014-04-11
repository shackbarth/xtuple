CREATE OR REPLACE FUNCTION deleteVendorAddress(INTEGER) RETURNS INTEGER  AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendaddrid ALIAS FOR $1;
  _test INTEGER;

BEGIN

--  Check to see if the passed vendor address is used in pohead
  SELECT pohead_id INTO _test
  FROM pohead
  WHERE (pohead_vendaddr_id=pVendaddrid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

--  Delete the passed vendor address
  DELETE FROM vendaddrinfo
  WHERE (vendaddr_id=pVendaddrid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
