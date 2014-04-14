
CREATE OR REPLACE FUNCTION formatWoBarcode(INTEGER) RETURNS TEXT IMMUTABLE AS $$
-- Copyright (c) 1999-2014 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/CPAL for the full text of the software license.
DECLARE
  pWoid ALIAS FOR $1;
  _barcode TEXT;
BEGIN

  SELECT ( E'\138WOXX' ||
           LENGTH(wo_number::TEXT) || LENGTH(wo_subnumber::TEXT) ||
           wo_number::TEXT || wo_subnumber::TEXT ) INTO _barcode
  FROM wo
  WHERE (wo_id=pWoid);

  RETURN _barcode;

END;
$$ LANGUAGE 'plpgsql';

