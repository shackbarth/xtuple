CREATE OR REPLACE FUNCTION deleteVendorType(INTEGER) RETURNS INTEGER  AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pVendtypeid ALIAS FOR $1;
  _test INTEGER;

BEGIN

--  Check to see if the passed vendor type is used in vendinfo
  SELECT vend_id INTO _test
  FROM vendinfo
  WHERE (vend_vendtype_id=pVendtypeid)
  LIMIT 1;
  IF (FOUND) THEN
    RETURN -1;
  END IF;

--  Delete the passed vendor type
  DELETE FROM vendtype
  WHERE (vendtype_id=pVendtypeid);

  RETURN 0;

END;
$$ LANGUAGE 'plpgsql';
