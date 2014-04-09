
CREATE OR REPLACE FUNCTION formatSoBarcode(INTEGER) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pSoheadid ALIAS FOR $1;
  _barcode TEXT;
BEGIN

  SELECT ( E'\138SOXX' ||
           LENGTH(TEXT(cohead_number)) || TEXT(cohead_number) ) INTO _barcode
  FROM cohead
  WHERE (cohead_id=pSoheadid);

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';

