
CREATE OR REPLACE FUNCTION formatLocationBarcode(INTEGER) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pLocationid ALIAS FOR $1;
  _barcode TEXT;
BEGIN

  SELECT ( E'\138LOXX' ||
           LENGTH(warehous_code)::TEXT || LTRIM(TO_CHAR(LENGTH(location_name::TEXT), '00')) ||
           warehous_code || location_name ) INTO _barcode
  FROM location, whsinfo
  WHERE ( (location_warehous_id=warehous_id)
   AND (location_id=pLocationid) );

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';

